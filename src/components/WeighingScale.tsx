'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, PlusIcon } from 'lucide-react';
import io from 'socket.io-client';
import Link from 'next/link';

interface WeighingScaleProps {
  onWeightChange?: (weight: number) => void;
  onWeightStabilize?: (weight: number) => void;
}

const WeighingScale: React.FC<WeighingScaleProps> = ({ onWeightChange, onWeightStabilize }) => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isStable, setIsStable] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [socket, setSocket] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const connectToScale = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      setErrorMessage('');

      const newSocket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to scale server');
        setConnectionStatus('connected');
        setErrorMessage('');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setErrorMessage(`Connection failed: ${error.message}`);
        setConnectionStatus('error');
      });

      newSocket.on('weight-update', (data) => {
        console.log('Weight update received:', data);
        setCurrentWeight(data.weight);
        setIsStable(data.isStable);
        onWeightChange?.(data.weight);
        if (data.isStable) {
          onWeightStabilize?.(data.weight);
        }
      });

      newSocket.on('scale-error', (error) => {
        console.error('Scale error:', error);
        setErrorMessage(error);
        // Don't set error status if we're getting data in simulation mode
        if (!error.includes('simulation')) {
          setConnectionStatus('error');
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from scale server');
        setConnectionStatus('disconnected');
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Connection error:', error);
      setErrorMessage('Failed to initialize connection');
      setConnectionStatus('error');
    }
  }, [onWeightChange, onWeightStabilize]);

  const disconnectScale = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnectionStatus('disconnected');
      setErrorMessage('');
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const captureWeight = () => {
    if (currentWeight > 0 && isStable) {
      onWeightChange?.(currentWeight);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Live Weight Reading</h3>
            <p className="text-sm text-gray-500">
              Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              {isStable && currentWeight > 0 && ' - Ready to Capture'}
            </p>
          </div>
          <Button
            onClick={connectionStatus === 'connected' ? disconnectScale : connectToScale}
            variant={connectionStatus === 'connected' ? "destructive" : "default"}
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connected' ? 'Disconnect' : 'Connect to Scale'}
          </Button>
        </div>

        <div className="text-center py-6">
          <div className="text-4xl font-bold text-indigo-600">
            {currentWeight.toFixed(2)} kg
          </div>
          <div className={`mt-2 text-sm ${isStable ? 'text-green-600' : 'text-orange-500'}`}>
            {isStable ? '✓ Stable Reading' : '⟳ Stabilizing...'}
          </div>
        </div>

        <Button
          onClick={captureWeight}
          variant="default"
          disabled={currentWeight <= 0 || !isStable}
          className="w-full"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Capture Current Weight
        </Button>

        {errorMessage && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeighingScale;