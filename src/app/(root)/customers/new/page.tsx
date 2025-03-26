'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { createCustomer } from '@/lib/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewCustomerPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const customerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    }

    try {
      await createCustomer(customerData)
      router.push('/customers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/customers"
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Customer</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </Label>
              <Textarea
                name="address"
                id="address"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/customers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
