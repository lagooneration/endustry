import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface WeightData {
  weight: number;
  isStable: boolean;
  timestamp: string;
  simulation?: boolean;
  debug?: {
    rawData: string;
    portStatus: string;
  };
}

const ScaleReader: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<{ rawData: string; portStatus: string }>({
    rawData: '',
    portStatus: 'Not connected'
  });

  const startReading = useCallback(async () => {
    try {
      // Clear any existing intervals
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Initial connection attempt
      const response = await fetch('/api/reader');
      let data;
      
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok && !data.simulation) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Initial data received:', data);

      // Update state with initial data
      if (data.simulation) {
        setIsSimulated(true);
        console.log('Running in simulation mode');
      }

      if (data.debug) {
        setDebugInfo(data.debug);
      }

      if (typeof data.weight === 'number') {
        setCurrentWeight(data.weight);
      }

      // Start polling
      const id = setInterval(async () => {
        try {
          const response = await fetch('/api/reader');
          const data = await response.json();

          if (!response.ok && !data.simulation) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
          }

          console.log('Weight data received:', data);

          if (data.debug) {
            setDebugInfo(data.debug);
          }

          if (typeof data.weight === 'number') {
            setCurrentWeight(data.weight);
            setError(null);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Reading error:', error);
          setError(error instanceof Error ? error.message : 'Failed to read weight');
          if (!isSimulated) {
            setIsConnected(false);
          }
        }
      }, 1000);

      setIntervalId(id);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection error:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnected(false);
    }
  }, [intervalId, isSimulated]);

  const stopReading = useCallback(async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    try {
      // Clean up the port connection
      await fetch('/api/reader', { method: 'DELETE' });
      setIsConnected(false);
      setError(null);
    } catch (error) {
      setError('Failed to disconnect properly');
    }
  }, [intervalId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={isConnected ? stopReading : startReading}
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? 'Disconnect' : 'Connect to Scale'}
        </Button>

        {/* Debug Information */}
        <div className="text-sm bg-gray-50 p-2 rounded border">
          <h4 className="font-medium text-gray-700">Debug Info:</h4>
          <div className="space-y-1 text-gray-600">
            <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
            <p>Mode: {isSimulated ? 'Simulation' : 'Hardware'}</p>
            <p>Status: {debugInfo.portStatus}</p>
            <div className="mt-1">
              <p className="font-medium">Raw Data:</p>
              <pre className="text-xs bg-gray-100 p-1 rounded overflow-x-auto">
                {debugInfo.rawData || 'No data'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-2 rounded">
          <p className="text-red-600 text-sm">
            Error: {error}
          </p>
        </div>
      )}

      {isConnected && (
        <div className="mt-4 p-4 bg-white border rounded shadow-sm">
          <p className="text-2xl font-semibold text-gray-900">
            {currentWeight.toFixed(1)} units
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScaleReader;