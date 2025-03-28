import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('Client connected to scale');
    let port: SerialPort | null = null;

    const initializePort = () => {
      try {
        // List available ports for debugging
        SerialPort.list().then(ports => {
          console.log('Available ports:', ports);
        });

        // Initialize Serial Port
        port = new SerialPort({
          path: process.env.ARDUINO_PORT || 'COM3',
          baudRate: parseInt(process.env.ARDUINO_BAUD_RATE || '9600'),
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
            console.log('Please ensure:');
            console.log('1. No other application is using COM3');
            console.log('2. You have sufficient permissions (try running as Administrator)');
            console.log('3. The correct drivers are installed');
            socket.emit('scale-error', 'Failed to open serial port: Access Denied');
            return;
          }
          console.log('Successfully connected to USB');

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
          
          // For testing without hardware
          if (dev) {
            simulateWeightData(socket);
          }
        });

      } catch (error) {
        console.error('Error initializing serial port:', error);
        socket.emit('scale-error', 'Failed to initialize serial port');
        
        // For testing without hardware
        if (dev) {
          simulateWeightData(socket);
        }
      }
    };

    // Initialize port connection
    initializePort();

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (port?.isOpen) {
        port.close();
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});

// Function to simulate weight data for testing
function simulateWeightData(socket: any) {
  let baseWeight = 1000; // Base weight in grams
  let interval = setInterval(() => {
    // Simulate small weight variations
    const variation = Math.random() * 10 - 5; // Random variation between -5 and +5
    const weight = baseWeight + variation;
    
    socket.emit('weight-update', {
      weight,
      isStable: Math.random() > 0.3, // 70% chance of being stable
      timestamp: new Date().toISOString()
    });
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
} 