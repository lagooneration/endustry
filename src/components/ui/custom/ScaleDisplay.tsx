'use client'
import { useState } from 'react'
import CustomerSelect from '@/components/layout/CustomerSelect'
import WeighingScale from '@/components/WeighingScale'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface ScaleDisplayProps {
  deviceId?: string;
}

export function ScaleDisplay({ deviceId }: ScaleDisplayProps) {
    const [grossWeight, setGrossWeight] = useState(0)
  const [tareWeight, setTareWeight] = useState(0)
  const [activeWeightField, setActiveWeightField] = useState<'gross' | 'tare' | null>(null)

  // Calculate net weight automatically
  const netWeight = grossWeight - tareWeight

  const handleManualWeightChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'gross' | 'tare') => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    if (type === 'gross') {
      setGrossWeight(value);
    } else {
      setTareWeight(value);
    }
  };

  const handleWeightChange = (weight: number) => {
    // Only update if a field is selected for capture
    if (activeWeightField === 'gross') {
      setGrossWeight(weight);
      // Automatically switch to tare after capturing gross
      setActiveWeightField('tare');
    } else if (activeWeightField === 'tare') {
      setTareWeight(weight);
      // Clear active field after capturing tare
      setActiveWeightField(null);
    }
  };

  const handleWeightStabilize = (weight: number) => {
    // Optionally handle stable weight readings
    console.log('Weight stabilized at:', weight)
  }
    
    return (
<div className="space-y-6">
          <WeighingScale
            onWeightChange={handleWeightChange}
            onWeightStabilize={handleWeightStabilize}
          />
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Weight Summary</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Gross Weight</Label>
                <div className="mt-1 text-2xl font-semibold">{grossWeight.toFixed(2)} kg</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Tare Weight</Label>
                <div className="mt-1 text-2xl font-semibold">{tareWeight.toFixed(2)} kg</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Net Weight</Label>
                <div className="mt-1 text-2xl font-semibold text-indigo-600">{netWeight.toFixed(2)} kg</div>
              </div>
            </div>
          </Card>
        </div>
    )
}