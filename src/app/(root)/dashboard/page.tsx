'use client'

import { Card } from '@/components/ui/card'
import { 
  DocumentTextIcon, 
  ScaleIcon, 
  CurrencyDollarIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { getInvoices, getWeightTickets } from '@/lib/actions'
import { format } from 'date-fns'
import Link from 'next/link'
import DashboardSkeleton from '@/components/ui/custom/DashboardSkeleton'

interface Invoice {
  id: string
  number: string
  customer: {
    name: string
  }
  total: number
  status: string
  date: string
}

interface WeightTicket {
  id: string
  ticketNumber: string
  truckNumber: string
  netWeight: number
  date: string | Date
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [weightTickets, setWeightTickets] = useState<WeightTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [invoicesData, ticketsData] = await Promise.all([
          getInvoices(),
          getWeightTickets()
        ])
        setInvoices(invoicesData)
        setWeightTickets(ticketsData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate stats
  const totalInvoices = invoices.length
  const totalWeightTickets = weightTickets.length
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  
  // Get unique truck count from weight tickets
  const uniqueTrucks = new Set(weightTickets.map(ticket => ticket.truckNumber)).size

  const stats = [
    { name: 'Total Invoices', value: totalInvoices.toString(), icon: DocumentTextIcon },
    { name: 'Total Weight Tickets', value: totalWeightTickets.toString(), icon: ScaleIcon },
    { name: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CurrencyDollarIcon },
    { name: 'Active Trucks', value: uniqueTrucks.toString(), icon: TruckIcon },
  ]

  // Get recent invoices and weight tickets (last 3)
  const recentInvoices = invoices.slice(0, 3)
  const recentWeightTickets = weightTickets.slice(0, 3)

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Invoices */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Recent Invoices</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {recentInvoices.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No invoices found</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Invoice
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Client
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            <Link href={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900">
                              {invoice.number}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.customer.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{invoice.total.toLocaleString()}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.status}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(invoice.date), 'PPP')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Weight Tickets */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Recent Weight Tickets</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {recentWeightTickets.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No weight tickets found</p>
                ) : (
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
                          Weight
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentWeightTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            <Link href={`/weight-tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">
                              {ticket.ticketNumber}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.truckNumber}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.netWeight} kg</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(ticket.date), 'PPP')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 