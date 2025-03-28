'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createWeightTicket } from '@/lib/actions'
import CustomerSelect from '@/components/layout/CustomerSelect'
import WeighingScale from '@/components/WeighingScale'

export default function NewWeightTicketPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [grossWeight, setGrossWeight] = useState(0)
  const [tareWeight, setTareWeight] = useState(0)

  // Calculate net weight automatically
  const netWeight = grossWeight - tareWeight

  const handleWeightChange = (weight: number) => {
    // Update the current weight field based on which weight is being measured
    if (grossWeight === 0) {
      setGrossWeight(weight)
    } else if (tareWeight === 0) {
      setTareWeight(weight)
    }
  }

  const handleWeightStabilize = (weight: number) => {
    // Optionally handle stable weight readings
    console.log('Weight stabilized at:', weight)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      ticketNumber: `WT-${Date.now()}`,
      customerId: formData.get('customerId') as string,
      date: new Date(),
      truckNumber: formData.get('truck-number') as string,
      driverName: formData.get('driver-name') as string,
      grossWeight: parseFloat(formData.get('gross-weight') as string),
      tareWeight: parseFloat(formData.get('tare-weight') as string),
      netWeight: parseFloat(formData.get('net-weight') as string),
      notes: formData.get('notes') as string,
    }

    try {
      await createWeightTicket(data)
      router.push('/weight-tickets')
      router.refresh()
    } catch (err) {
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
                <CustomerSelect />
              </div>
            </div>

            {/* Truck Information */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Truck Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="truck-number" className="block text-sm font-medium text-gray-700">
                    Truck Number
                  </label>
                  <Input
                    type="text"
                    name="truck-number"
                    id="truck-number"
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label htmlFor="driver-name" className="block text-sm font-medium text-gray-700">
                    Driver Name
                  </label>
                  <Input
                    type="text"
                    name="driver-name"
                    id="driver-name"
                    required
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
            </div>

            {/* Weight Measurements */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Weight Measurements</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="gross-weight" className="block text-sm font-medium text-gray-700">
                    Gross Weight (kg)
                  </label>
                  <Input
                    type="number"
                    name="gross-weight"
                    id="gross-weight"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label htmlFor="tare-weight" className="block text-sm font-medium text-gray-700">
                    Tare Weight (kg)
                  </label>
                  <Input
                    type="number"
                    name="tare-weight"
                    id="tare-weight"
                    required
                    value={tareWeight}
                    onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label htmlFor="net-weight" className="block text-sm font-medium text-gray-700">
                    Net Weight (kg)
                  </label>
                  <Input
                    type="number"
                    name="net-weight"
                    id="net-weight"
                    required
                    value={netWeight}
                    readOnly
                    className="mt-1 block w-full bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <Textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  className="mt-1 block w-full"
                  placeholder="Add any additional information about this weight ticket"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Form Actions */}
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

        <div className="space-y-6">
          <WeighingScale
            onWeightChange={handleWeightChange}
            onWeightStabilize={handleWeightStabilize}
          />
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Weight Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Gross Weight</label>
                <div className="mt-1 text-2xl font-semibold">{grossWeight.toFixed(2)} kg</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tare Weight</label>
                <div className="mt-1 text-2xl font-semibold">{tareWeight.toFixed(2)} kg</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Net Weight</label>
                <div className="mt-1 text-2xl font-semibold text-indigo-600">{netWeight.toFixed(2)} kg</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}