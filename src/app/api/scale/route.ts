import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { NextResponse } from 'next/server';

declare global {
  var io: Server | undefined;
}

export async function GET(req: Request) {
  if (!global.io) {
    console.log('Initializing Socket.IO server...');
    
    // Initialize Socket.IO
    global.io = new Server({
      path: '/api/scale',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    global.io.on('connection', (socket) => {
      console.log('Client connected to scale');
      let port: SerialPort | null = null;

      try {
        // Initialize Serial Port
        port = new SerialPort({
          path: process.env.ARDUINO_PORT || 'COM3',
          baudRate: 9600,
          autoOpen: false
        });

        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        // Track weight stability
        let lastWeight = 0;
        let stabilityCounter = 0;
        const STABILITY_THRESHOLD = 0.1;
        const STABILITY_COUNT = 5;

        // Open port
        port.open((err) => {
          if (err) {
            console.error('Error opening port:', err);
            socket.emit('scale-error', 'Failed to open serial port');
            return;
          }

          console.log('Serial port opened successfully');

          // Handle incoming data
          parser.on('data', (data: string) => {
            try {
              const weight = parseFloat(data);
              if (!isNaN(weight)) {
                const isStable = Math.abs(weight - lastWeight) < STABILITY_THRESHOLD;
                if (isStable) {
                  stabilityCounter++;
                } else {
                  stabilityCounter = 0;
                }

                socket.emit('weight-update', {
                  weight,
                  isStable: stabilityCounter >= STABILITY_COUNT,
                  timestamp: new Date().toISOString()
                });

                lastWeight = weight;
              }
            } catch (error) {
              console.error('Error parsing weight data:', error);
            }
          });
        });

        // Handle port errors
        port.on('error', (error) => {
          console.error('Serial port error:', error);
          socket.emit('scale-error', 'Serial port error');
        });

        // Clean up on disconnect
        socket.on('disconnect', () => {
          console.log('Client disconnected');
          if (port?.isOpen) {
            port.close();
          }
        });

      } catch (error) {
        console.error('Error initializing serial port:', error);
        socket.emit('scale-error', 'Failed to initialize serial port');
      }
    });
  }

  return NextResponse.json({ message: 'Socket.IO server initialized' });
}