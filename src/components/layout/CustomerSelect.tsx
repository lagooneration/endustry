import { getCustomers } from '@/lib/actions'

export default async function CustomerSelect() {
  const customers = await getCustomers()

  return (
    <div>
      <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
        Customer
      </label>
      <select
        name="customerId"
        id="customerId"
        required
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-indigo-500 focus:ring-indigo-500"
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