'use client'

import { Card } from '@/components/ui/card'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { format } from 'date-fns'
import { getWeightTickets } from '@/lib/actions'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WeightTicketsSkeleton } from '@/components/ui/custom/WeightTicketsSkeleton'
// Define the WeightTicket type based on the schema and actions
interface WeightTicket {
  id: string
  ticketNumber: string
  customerId: string
  date: string | Date
  truckNumber: string
  driverName: string
  grossWeight: number
  tareWeight: number
  netWeight: number
  notes?: string
  invoiceId?: string | null
  customer: {
    id: string
    name: string
    email: string
    phone: string
    address: string
    userId: string
  }
  invoice: {
    id: string
    customer: {
      id: string
      name: string
    }
  } | null
}

export default function WeightTicketsPage() {
  const router = useRouter()
  const [weightTickets, setWeightTickets] = useState<WeightTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWeightTickets() {
      try {
        const tickets = await getWeightTickets()
        setWeightTickets(tickets)
      } catch (err) {
        console.error('Failed to load weight tickets:', err)
        setError('Failed to load weight tickets')
      } finally {
        setLoading(false)
      }
    }
    loadWeightTickets()
  }, [])

  if (loading) {
    return <WeightTicketsSkeleton />
  }

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
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Weight Ticket
        </Link>
      </div>
      
      {/* Weight Tickets List */}
      <Card className="p-6">
        {error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : weightTickets.length === 0 ? (
          <p className="text-center py-4">No weight tickets found. Create your first one!</p>
        ) : (
          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Ticket Number
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Truck Number
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
                          {ticket.ticketNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.customer.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.truckNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.driverName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.grossWeight.toLocaleString()} kg
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.tareWeight.toLocaleString()} kg
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.netWeight.toLocaleString()} kg
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(ticket.date), 'PPP')}
                        </td>
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
        )}
      </Card>
    </div>
  )
}