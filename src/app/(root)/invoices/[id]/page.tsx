import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { format } from 'date-fns'
import { getInvoiceById } from '@/lib/actions'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/layout/PrintButton'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    address: string
  }
  items: InvoiceItem[]
  notes?: string
  total: number
  status: string
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  let invoice: Invoice | null = null
  
  try {
    invoice = await getInvoiceById(params.id) as unknown as Invoice
  } catch (error) {
    console.error('Error fetching invoice:', error)
    notFound()
  }

  if (!invoice) {
    notFound()
  }

  // Calculate subtotal from items
  const subtotal = invoice.items?.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  ) ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/invoices"
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Invoice #{invoice.number}</h1>
        </div>
        <PrintButton />
      </div>

      <Card className="p-6 print:shadow-none print:border-none">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">From</h2>
            <p className="text-gray-700">Your Company Name</p>
            <p className="text-gray-700">123 Business Street</p>
            <p className="text-gray-700">City, State ZIP</p>
            <p className="text-gray-700">contact@yourcompany.com</p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">To</h2>
            <p className="text-gray-700">{invoice.customer.name}</p>
            <p className="text-gray-700">{invoice.customer.email}</p>
            <p className="text-gray-700">{invoice.customer.phone}</p>
            <p className="text-gray-700">{invoice.customer.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-500">Invoice Number:</p>
              <p className="text-gray-700">{invoice.number}</p>
              
              <p className="text-gray-500">Date:</p>
              <p className="text-gray-700">{format(new Date(invoice.date), 'MMM d, yyyy')}</p>
              
              <p className="text-gray-500">Due Date:</p>
              <p className="text-gray-700">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
              
              <p className="text-gray-500">Status:</p>
              <p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : invoice.status === 'OVERDUE'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {invoice.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500">GST (18%)</dt>
              <dd className="text-sm font-medium text-gray-900">₹{(subtotal * 0.18).toFixed(2)}</dd>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <dt className="text-base font-bold text-gray-900">Total</dt>
              <dd className="text-base font-bold text-gray-900">₹{invoice.total.toFixed(2)}</dd>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
