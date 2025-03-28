import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { NextResponse } from 'next/server';

declare global {
  var io: Server | undefined;
}

export async function GET(req: Request) {
  try {
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

          port.open((err) => {
            if (err) {
              console.error('Detailed port error:', err.message);
              socket.emit('scale-error', `Port error: ${err.message}`);
              return;
            }
            
            console.log('Successfully connected to COM3');
            
            // Set up error handlers
            port.on('error', (error) => {
              console.error('Port runtime error:', error);
              socket.emit('scale-error', `Runtime error: ${error.message}`);
            });

            // Handle incoming data
            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

            // Track weight stability
            let lastWeight = 0;
            let stabilityCounter = 0;
            const STABILITY_THRESHOLD = 0.1;
            const STABILITY_COUNT = 5;

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

          // Clean up on disconnect
          socket.on('disconnect', () => {
            console.log('Client disconnected');
            if (port?.isOpen) {
              port.close();
            }
          });

        } catch (error) {
          console.error('Port initialization error:', error);
          socket.emit('scale-error', 'Failed to initialize port');
        }
      });

      return NextResponse.json({ 
        status: 'success',
        message: 'Socket.IO server initialized' 
      });
    }

    return NextResponse.json({ 
      status: 'success',
      message: 'Socket.IO server already running' 
    });

  } catch (error) {
    console.error('Server initialization error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}