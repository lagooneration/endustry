'use client'
import { useEffect, useState } from 'react'
import { getCustomers } from '@/lib/actions'

interface Customer {
  id: string
  name: string
}

export function CustomerSelectClient({ 
  onChange 
}: { 
  onChange: (customerId: string) => void 
}) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  if (loading) {
    return <select disabled><option>Loading customers...</option></select>
  }

  return (
    <div>
      <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
        Customer
      </label>
      <select
        name="customerId"
        id="customerId"
        required
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Select a customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </div>
  )
}