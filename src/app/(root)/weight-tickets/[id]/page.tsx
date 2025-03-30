import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { getWeightTickets } from '@/lib/actions'
import PrintButton from '@/components/layout/PrintButton'
import { WeightTicketsSkeleton } from '@/components/ui/custom/WeightTicketsSkeleton'
import { Suspense } from 'react'

export default async function WeightTicketPage({ params }: { params: { id: string } }) {
  let weightTicket = null
  
  try {
    const weightTickets = await getWeightTickets()
    weightTicket = weightTickets.find(ticket => ticket.id === params.id)
  } catch (error) {
    console.error('Error fetching weight ticket:', error)
    notFound()
  }

  if (!weightTicket) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/weight-tickets"
            className="mr-4 rounded-full bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Weight Ticket #{weightTicket.ticketNumber}
          </h1>
        </div>
        <PrintButton />
      </div>

      <Suspense fallback={<WeightTicketsSkeleton />}>
        <Card className="overflow-hidden p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Ticket Details</h2>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="text-sm text-gray-900">
                    {format(new Date(weightTicket.date), 'PPP')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Truck Number</dt>
                  <dd className="text-sm text-gray-900">{weightTicket.truckNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Driver</dt>
                  <dd className="text-sm text-gray-900">{weightTicket.driverName}</dd>
                </div>
              </dl>
            </div>

            {/* <div>
              <h2 className="text-lg font-medium text-gray-900">Customer</h2>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{weightTicket.invoice?.customer.name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Invoice</dt>
                  <dd className="text-sm text-gray-900">
                    {weightTicket.invoice ? (
                      <Link 
                        href={`/invoices/${weightTicket.invoice.id}`}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {weightTicket.invoice.id}
                      </Link>
                    ) : (
                      'No invoice attached'
                    )}
                  </dd>
                </div>
              </dl>
            </div> */}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Weight Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500">Gross Weight</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {weightTicket.grossWeight.toLocaleString()} kg
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500">Tare Weight</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {weightTicket.tareWeight.toLocaleString()} kg
                </dd>
              </div>
              <div className="rounded-lg bg-indigo-50 p-4">
                <dt className="text-sm font-medium text-indigo-700">Net Weight</dt>
                <dd className="mt-1 text-2xl font-semibold text-indigo-700">
                  {weightTicket.netWeight.toLocaleString()} kg
                </dd>
              </div>
            </div>
          </div>

          {weightTicket.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Notes</h2>
              <div className="mt-2 rounded-md bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700">{weightTicket.notes}</p>
              </div>
            </div>
          )}
        </Card>
      </Suspense>
    </div>
  )
}
