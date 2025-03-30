'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CustomerSelectClient } from '@/components/layout/CustomerSelectClient'
import { Label } from '@/components/ui/label'
import { NetWeight } from '@/components/ui/custom/NetWeight'
import { WeightSourceSelector } from '@/components/ui/custom/WeightSourceSelector'

interface WeightTicketForm {
  customerId: string;
  truckNumber: string;
  driverName: string;
  grossWeight: string;
  tareWeight: string;
  netWeight: string;
  notes: string;
}

export default function NewWeightTicketPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<WeightTicketForm>({
    customerId: '',
    truckNumber: '',
    driverName: '',
    grossWeight: '',
    tareWeight: '',
    netWeight: '',
    notes: ''
  })

  // Update form data
  const updateFormData = (field: keyof WeightTicketForm, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      // Calculate net weight if both gross and tare weights are present
      if (field === 'grossWeight' || field === 'tareWeight') {
        const gross = parseFloat(field === 'grossWeight' ? value : prev.grossWeight)
        const tare = parseFloat(field === 'tareWeight' ? value : prev.tareWeight)
        if (!isNaN(gross) && !isNaN(tare)) {
          newData.netWeight = (gross - tare).toString()
        }
      }
      return newData
    })
  }

  // Handle weight capture from NetWeight component
  const handleGrossWeightCapture = (weight: number) => {
    updateFormData('grossWeight', weight.toString())
  }

  const handleTareWeightCapture = (weight: number) => {
    updateFormData('tareWeight', weight.toString())
  }

  const handleNetWeightUpdate = (weight: number) => {
    updateFormData('netWeight', weight.toString())
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.customerId) {
      setError('Please select a customer')
      setLoading(false)
      return
    }

    const gross = parseFloat(formData.grossWeight)
    const tare = parseFloat(formData.tareWeight)
    const net = parseFloat(formData.netWeight)

    if (isNaN(gross) || isNaN(tare) || isNaN(net)) {
      setError('Invalid weight values')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/weight-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketNumber: `WT-${Date.now()}`,
          customerId: formData.customerId,
          date: new Date(),
          truckNumber: formData.truckNumber,
          driverName: formData.driverName,
          grossWeight: gross,
          tareWeight: tare,
          netWeight: net,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create weight ticket')
      }

      router.push('/weight-tickets')
      router.refresh()
    } catch (err) {
      console.error('Create ticket error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create weight ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/weight-tickets" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">New Weight Ticket</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Selection */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Customer Information</h2>
              <div className="mt-4">
                <CustomerSelectClient 
                  onChange={(customerId) => updateFormData('customerId', customerId)} 
                />
              </div>
            </div>

            {/* Truck Information */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Truck Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="truck-number">Truck Number</Label>
                  <Input
                    type="text"
                    id="truck-number"
                    value={formData.truckNumber}
                    onChange={(e) => updateFormData('truckNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="driver-name">Driver Name</Label>
                  <Input
                    type="text"
                    id="driver-name"
                    value={formData.driverName}
                    onChange={(e) => updateFormData('driverName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Weight Display */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Weight Measurements</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <Label htmlFor="gross-weight">Gross Weight (kg)</Label>
                  <Input
                    type="number"
                    id="gross-weight"
                    value={formData.grossWeight}
                    onChange={(e) => updateFormData('grossWeight', e.target.value)}
                    required
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="tare-weight">Tare Weight (kg)</Label>
                  <Input
                    type="number"
                    id="tare-weight"
                    value={formData.tareWeight}
                    onChange={(e) => updateFormData('tareWeight', e.target.value)}
                    required
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="net-weight">Net Weight (kg)</Label>
                  <Input
                    type="number"
                    id="net-weight"
                    value={formData.netWeight}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={3}
                placeholder="Add any additional information"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="flex justify-end gap-x-4">
              <Link
                href="/weight-tickets"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Weight Ticket'}
              </button>
            </div>
          </form>
        </Card>

        {/* Weight Capture Component */}
        <div className="space-y-6">
          <WeightSourceSelector
            onGrossWeightCapture={handleGrossWeightCapture}
            onTareWeightCapture={handleTareWeightCapture}
            onNetWeightUpdate={handleNetWeightUpdate}
          />
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Weight Capture Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Ensure a scale is connected or select manual entry</li>
              <li>Click "Start Gross Weight" to begin capturing</li>
              <li>Wait for stable reading or enter weight manually</li>
              <li>Click capture button to record gross weight</li>
              <li>Remove the load and repeat process for tare weight</li>
              <li>Net weight will be calculated automatically</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}