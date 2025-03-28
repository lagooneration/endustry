"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Define types for Serial API since TypeScript doesn't include them by default
interface SerialPortInfo {
  path: string;
  [key: string]: any;
}

interface SerialPort {
  open: (options: { baudRate: number }) => Promise<void>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => Promise<void>;
  info: SerialPortInfo;
}

declare global {
  interface Navigator {
    serial: {
      requestPort: (options?: { filters?: Array<{ usbVendorId?: number; usbProductId?: number }> }) => Promise<SerialPort>;
      getPorts: () => Promise<SerialPort[]>;
    };
  }
}

const WeighingScaleReader = () => {
  // State for managing weighing scale data
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isStable, setIsStable] = useState<boolean>(false);
  const [recordedWeights, setRecordedWeights] = useState<number[]>([]);

  // Configuration for serial port connection
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [availablePorts, setAvailablePorts] = useState<SerialPort[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>('');

  // Check for available serial ports
  const checkAvailablePorts = async () => {
    if ('serial' in navigator) {
      try {
        const ports = await navigator.serial.getPorts();
        setAvailablePorts(ports);
        console.log('Available Ports:', ports);
      } catch (error) {
        console.error('Error checking ports:', error);
      }
    } else {
      console.error('Web Serial API not supported in this browser');
    }
  };

  // Connect to Arduino COM port
  const connectToArduino = async () => {
    try {
      let port: SerialPort;
      
      // If no port selected, request port selection
      if (!selectedPort) {
        port = await navigator.serial.requestPort({
          filters: [] // Empty array is valid and will show all available ports
        });
      } else {
        // Use the selected port
        const foundPort = availablePorts.find(p => p.info.path === selectedPort);
        if (!foundPort) {
          throw new Error('Selected port not found');
        }
        port = foundPort;
      }

      if (!port) {
        console.error('No port selected');
        return;
      }

      await port.open({ 
        baudRate: 9600, // Adjust based on your Arduino setup
      });

      setSerialPort(port);
      setIsConnected(true);

      // Start reading data
      const reader = port.readable.getReader();
      
      // Async function to read data
      const readData = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            // Convert received data to weight
            const decodedWeight = parseWeightData(value);
            setCurrentWeight(decodedWeight);
            
            // Check weight stability 
            checkWeightStability(decodedWeight);
          }
        } catch (error) {
          console.error('Serial reading error:', error);
        } finally {
          reader.releaseLock();
        }
      };

      readData();

    } catch (error: unknown) {
      console.error('Serial port connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Connection Error: ${errorMessage}`);
    }
  };

  // Parse weight data from Arduino
  const parseWeightData = (rawData: Uint8Array): number => {
    try {
      const decoder = new TextDecoder();
      const text = decoder.decode(rawData);
      console.log('Raw Received Data:', text);
      return parseFloat(text) || 0;
    } catch (error) {
      console.error('Weight parsing error:', error);
      return 0;
    }
  };

  // Stability check logic
  const checkWeightStability = (weight: number) => {
    const STABILITY_THRESHOLD = 0.1;
    const STABILITY_DURATION = 2000;

    let stableTimer = setTimeout(() => {
      setIsStable(true);
    }, STABILITY_DURATION);

    if (Math.abs(weight - currentWeight) > STABILITY_THRESHOLD) {
      clearTimeout(stableTimer);
      setIsStable(false);
    }
  };

  // Record stable weight
  const recordWeight = () => {
    if (isStable) {
      setRecordedWeights(prev => [...prev, currentWeight]);
    }
  };

  // Disconnect from serial port
  const disconnectArduino = async () => {
    if (serialPort) {
      await serialPort.close();
      setSerialPort(null);
      setIsConnected(false);
    }
  };

  // Check for available ports on component mount
  useEffect(() => {
    checkAvailablePorts();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3>Debug Information:</h3>
        {availablePorts.length > 0 ? (
          <select 
            value={selectedPort} 
            onChange={(e) => setSelectedPort(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a Port</option>
            {availablePorts.map((port, index) => (
              <option key={index} value={port.info.path}>
                {port.info.path || `Port ${index + 1}`}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-red-500">No ports detected. Ensure:</p>
        )}
        
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>Arduino is connected</li>
          <li>Correct COM port is selected</li>
          <li>Browser supports Web Serial API</li>
          <li>Proper USB drivers are installed</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          onClick={isConnected ? disconnectArduino : connectToArduino}
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? 'Disconnect' : 'Connect to Scale'}
        </Button>

        {isConnected && (
          <Button 
            onClick={recordWeight} 
            disabled={!isStable}
            variant="secondary"
          >
            Record Weight
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <p>Current Weight: {currentWeight.toFixed(2)} units</p>
        <p>Weight Stable: {isStable ? 'Yes' : 'No'}</p>
        
        <div>
          <h3>Recorded Weights:</h3>
          <ul>
            {recordedWeights.map((weight, index) => (
              <li key={index}>{weight.toFixed(2)} units</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeighingScaleReader;