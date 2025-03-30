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
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-lg mb-2">Billed To:</h2>
            <p className="text-gray-700">{invoice.customer.name}</p>
            <p className="text-gray-700">{invoice.customer.address}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-700">Invoice No: #{invoice.number}</p>
            <p className="text-gray-700">Issued on: {format(new Date(invoice.date), 'MMMM d, yyyy')}</p>
            <p className="text-gray-700">Payment Due: {format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
          </div>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Services</th>
                <th className="text-center py-3 px-4">Qty.</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="text-center py-3 px-4">{item.quantity}</td>
                  <td className="text-right py-3 px-4">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Total (INR)</span>
              <span className="font-bold">₹{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 border-t">
          <div>
            <div className="mb-2">
              <img src="/company-logo.png" alt="Company Logo" className="h-8 w-8" />
              <h3 className="font-medium mt-2">Dudi Ram Pvt. Ltd</h3>
            </div>
            <p className="text-sm text-gray-600">email@company.com</p>
            <p className="text-sm text-gray-600">IFSC: ABC-098765432</p>
            <p className="text-sm text-gray-600">UPI ID: 123456789-123</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Payment Instructions</h3>
            <p className="text-sm text-gray-600">Bank transfer, UPI</p>
            <p className="text-sm text-gray-600">UPI Label: 123456789-123</p>
            <p className="text-sm text-gray-600">IFSC Label: ABC-098765432</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Additional Notes</h3>
            <p className="text-sm text-gray-600">Have a great day</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
