import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface ScaleData {
  weight: number;
  isStable: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useScaleSocket() {
  const [scaleData, setScaleData] = useState<ScaleData>({
    weight: 0,
    isStable: false,
    isConnected: false,
    error: null
  });

  useEffect(() => {
    const socket = io({
      path: '/api/scale',
      addTrailingSlash: false,
    });

    socket.on('connect', () => {
      setScaleData(prev => ({ ...prev, isConnected: true }));
      console.log('Connected to local scale');
    });

    socket.on('weight-update', (data: { weight: number; isStable: boolean }) => {
      setScaleData(prev => ({
        ...prev,
        weight: data.weight,
        isStable: data.isStable
      }));
    });

    socket.on('scale-error', (error: string) => {
      setScaleData(prev => ({ ...prev, error }));
      console.error('Scale error:', error);
    });

    socket.on('disconnect', () => {
      setScaleData(prev => ({ ...prev, isConnected: false }));
      console.log('Disconnected from local scale');
    });

    return () => {
      socket.close();
    };
  }, []);

  return scaleData;
}