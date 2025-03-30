'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useThingsboardSocket } from '@/hooks/useThingsboardSocket'
import { useScaleSocket } from '@/hooks/useScaleSocket'
import { AlertCircle } from 'lucide-react'

interface WeightSourceSelectorProps {
  onGrossWeightCapture: (weight: number) => void;
  onTareWeightCapture: (weight: number) => void;
  onNetWeightUpdate: (weight: number) => void;
}

export function WeightSourceSelector({
  onGrossWeightCapture,
  onTareWeightCapture,
  onNetWeightUpdate
}: WeightSourceSelectorProps) {
  const [captureMode, setCaptureMode] = useState<'gross' | 'tare' | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualWeight, setManualWeight] = useState('');
  
  // Get weight data from both sources
  const tbData = useThingsboardSocket();
  const scaleData = useScaleSocket();

  // Determine which source is available
  const isLocalScaleConnected = scaleData.isConnected;
  const isThingsboardConnected = tbData.isConnected;
  const hasActiveConnection = isLocalScaleConnected || isThingsboardConnected;

  // Use local scale weight if available, otherwise use ThingsBoard weight
  const currentWeight = isLocalScaleConnected ? scaleData.weight : tbData.weight;
  const isStable = isLocalScaleConnected ? scaleData.isStable : true;

  const handleWeightCapture = () => {
    if (manualMode) {
      const weight = parseFloat(manualWeight);
      if (!isNaN(weight)) {
        if (captureMode === 'gross') {
          onGrossWeightCapture(weight);
          setCaptureMode('tare');
        } else if (captureMode === 'tare') {
          onTareWeightCapture(weight);
          setCaptureMode(null);
        }
        setManualWeight('');
      }
    } else if (isStable) {
      if (captureMode === 'gross') {
        onGrossWeightCapture(currentWeight);
        setCaptureMode('tare');
      } else if (captureMode === 'tare') {
        onTareWeightCapture(currentWeight);
        setCaptureMode(null);
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Weight Capture</h3>
            <p className="text-sm text-gray-500">
              {hasActiveConnection 
                ? `Connected to ${isLocalScaleConnected ? 'Local Scale' : 'ThingsBoard'}`
                : 'No scale connection available'}
            </p>
          </div>
          {!hasActiveConnection && (
            <Button
              onClick={() => setManualMode(true)}
              variant="secondary"
            >
              Enter Weight Manually
            </Button>
          )}
        </div>

        {!hasActiveConnection && !manualMode && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">No scale connection detected. Please connect a scale or switch to manual entry.</p>
          </div>
        )}

        {manualMode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="manual-weight">Manual Weight Entry (kg)</Label>
              <Input
                id="manual-weight"
                type="number"
                value={manualWeight}
                onChange={(e) => setManualWeight(e.target.value)}
                placeholder="Enter weight in kg"
              />
            </div>
          </div>
        ) : hasActiveConnection && (
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-indigo-600">
              {currentWeight} kg
            </div>
            <div className={`mt-2 text-sm ${isStable ? 'text-green-600' : 'text-orange-500'}`}>
              {isStable ? '✓ Stable Reading' : '⟳ Stabilizing...'}
            </div>
          </div>
        )}

        {(hasActiveConnection || manualMode) && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => setCaptureMode('gross')}
                disabled={captureMode !== null}
              >
                Start Gross Weight
              </Button>
              <Button
                className="flex-1"
                onClick={() => setCaptureMode('tare')}
                disabled={captureMode !== null}
              >
                Start Tare Weight
              </Button>
            </div>

            {captureMode && (
              <Button 
                className="w-full"
                onClick={handleWeightCapture}
                disabled={!manualMode && !isStable}
              >
                Capture {captureMode === 'gross' ? 'Gross' : 'Tare'} Weight
              </Button>
            )}
          </div>
        )}

        {(scaleData.error || tbData.error) && (
          <p className="text-sm text-red-500 mt-2">
            Error: {scaleData.error || tbData.error}
          </p>
        )}
      </div>
    </Card>
  );
}