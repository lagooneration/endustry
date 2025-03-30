'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useThingsboardSocket } from '@/hooks/useThingsboardSocket'
import { useScaleSocket } from '@/hooks/useScaleSocket'

interface NetWeightProps {
  onGrossWeightCapture: (weight: number) => void;
  onTareWeightCapture: (weight: number) => void;
  onNetWeightUpdate: (weight: number) => void;
}

export function NetWeight({
  onGrossWeightCapture,
  onTareWeightCapture,
  onNetWeightUpdate
}: NetWeightProps) {
  const [captureMode, setCaptureMode] = useState<'gross' | 'tare' | null>(null);
  const [grossWeight, setGrossWeight] = useState<number>(0);
  const [tareWeight, setTareWeight] = useState<number>(0);
  
  // Get weight data from both sources
  const tbData = useThingsboardSocket();
  const scaleData = useScaleSocket();

  // Use local scale weight if available, otherwise use ThingsBoard weight
  const currentWeight = scaleData.isConnected ? scaleData.weight : tbData.weight;
  const isStable = scaleData.isConnected ? scaleData.isStable : true;

  // Calculate net weight whenever gross or tare weight changes
  useEffect(() => {
    const netWeight = grossWeight - tareWeight;
    onNetWeightUpdate(netWeight);
  }, [grossWeight, tareWeight, onNetWeightUpdate]);

  const handleWeightCapture = () => {
    if (!isStable) return;

    if (captureMode === 'gross') {
      setGrossWeight(currentWeight);
      onGrossWeightCapture(currentWeight);
      setCaptureMode('tare');
    } else if (captureMode === 'tare') {
      setTareWeight(currentWeight);
      onTareWeightCapture(currentWeight);
      setCaptureMode(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Weight Capture</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setCaptureMode('gross')}
              variant={captureMode === 'gross' ? "default" : "outline"}
              disabled={captureMode === 'tare'}
            >
              Capture Gross
            </Button>
            <Button
              onClick={() => setCaptureMode('tare')}
              variant={captureMode === 'tare' ? "default" : "outline"}
              disabled={captureMode === 'gross' || grossWeight === 0}
            >
              Capture Tare
            </Button>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="text-4xl font-bold text-indigo-600">
            {currentWeight.toFixed(2)} kg
          </div>
          <div className={`mt-2 text-sm ${isStable ? 'text-green-600' : 'text-orange-500'}`}>
            {isStable ? '✓ Stable Reading' : '⟳ Stabilizing...'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Gross Weight</h4>
            <p className="text-lg font-semibold">{grossWeight.toFixed(2)} kg</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Tare Weight</h4>
            <p className="text-lg font-semibold">{tareWeight.toFixed(2)} kg</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Net Weight</h4>
            <p className="text-lg font-semibold">{(grossWeight - tareWeight).toFixed(2)} kg</p>
          </div>
        </div>

        {captureMode && (
          <Button 
            className="w-full"
            onClick={handleWeightCapture}
            disabled={!isStable}
          >
            Capture {captureMode === 'gross' ? 'Gross' : 'Tare'} Weight
          </Button>
        )}

        <div className="text-sm text-gray-500">
          Data Source: {scaleData.isConnected ? 'Local Scale' : 'ThingsBoard'}
          {scaleData.error || tbData.error ? (
            <p className="text-red-500 mt-1">
              Error: {scaleData.error || tbData.error}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}