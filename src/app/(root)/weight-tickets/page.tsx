'use client'

import { Card } from '@/components/ui/card'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useWeightSocket } from '@/hooks/useWeightSocket'
import { format } from 'date-fns'

const weightTickets = [
  { id: 'WT-001', truck: 'TRK-123', driver: 'John Doe', grossWeight: '25,000 kg', tareWeight: '5,000 kg', netWeight: '20,000 kg', date: '2024-03-15' },
  { id: 'WT-002', truck: 'TRK-456', driver: 'Jane Smith', grossWeight: '30,000 kg', tareWeight: '5,000 kg', netWeight: '25,000 kg', date: '2024-03-14' },
  { id: 'WT-003', truck: 'TRK-789', driver: 'Bob Johnson', grossWeight: '28,000 kg', tareWeight: '5,000 kg', netWeight: '23,000 kg', date: '2024-03-13' },
]

export default function WeightTicketsPage() {
  const { weight, lastUpdate } = useWeightSocket()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Weight Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track truck weight measurements
          </p>
        </div>
        <Link
          href="/weight-tickets/new"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Weight Ticket
        </Link>
      </div>

      {/* Live Weight Display */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Current Weight Reading</h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time weight from the scale
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-indigo-600">{weight.toLocaleString()} kg</div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate ? format(new Date(lastUpdate), 'PPpp') : 'Never'}
            </div>
          </div>
        </div>
      </Card>

      {/* Weight Tickets List */}
      <Card className="p-6">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Ticket
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Truck
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Driver
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Gross Weight
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tare Weight
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Net Weight
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weightTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {ticket.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.truck}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.driver}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.grossWeight}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.tareWeight}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.netWeight}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.date}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/weight-tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 