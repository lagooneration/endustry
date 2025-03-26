import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function NewWeightTicketPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-4">
        <Link
          href="/weight-tickets"
          className="text-gray-400 hover:text-gray-500"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Weight Ticket</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new weight ticket for a truck
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form className="space-y-8">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  Gross Weight
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    type="number"
                    name="gross-weight"
                    id="gross-weight"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">kg</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="tare-weight" className="block text-sm font-medium text-gray-700">
                  Tare Weight
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    type="number"
                    name="tare-weight"
                    id="tare-weight"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">kg</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="net-weight" className="block text-sm font-medium text-gray-700">
                  Net Weight
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    type="number"
                    name="net-weight"
                    id="net-weight"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

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
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Weight Ticket
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
} 