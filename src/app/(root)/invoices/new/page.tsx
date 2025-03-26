'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { createInvoice } from '@/lib/actions'
import CustomerSelect from '@/components/layout/CustomerSelect'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function NewInvoicePage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      number: formData.get('number') as string,
      date: new Date(formData.get('date') as string),
      dueDate: new Date(formData.get('dueDate') as string),
      customerId: formData.get('customerId') as string,
      items: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      notes: formData.get('notes') as string,
    }

    try {
      await createInvoice(data)
      router.push('/invoices')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  function updateItem(index: number, field: string, value: string) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/invoices"
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Invoice</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Invoice Number
              </Label>
              <Input
                type="text"
                name="number"
                id="number"
                required
                className="mt-1"
              />
            </div>

            <Suspense fallback={<div>Loading customers...</div>}>
              <CustomerSelect />
            </Suspense>

            <div>
              <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </Label>
              <Input
                type="date"
                name="date"
                id="date"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </Label>
              <Input
                type="date"
                name="dueDate"
                id="dueDate"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      required
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      Unit Price
                    </Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </Label>
            <Textarea
              name="notes"
              id="notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/invoices"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
} 