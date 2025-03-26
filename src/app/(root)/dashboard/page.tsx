import { Card } from '@/components/ui/card'
import { 
  DocumentTextIcon, 
  ScaleIcon, 
  CurrencyDollarIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'Total Invoices', value: '12', icon: DocumentTextIcon },
  { name: 'Total Weight Tickets', value: '24', icon: ScaleIcon },
  { name: 'Total Revenue', value: '₹12,345', icon: CurrencyDollarIcon },
  { name: 'Active Trucks', value: '8', icon: TruckIcon },
]

const recentInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: '₹1,234', status: 'Paid', date: '2024-03-15' },
  { id: 'INV-002', client: 'Globex Corp', amount: '₹2,345', status: 'Pending', date: '2024-03-14' },
  { id: 'INV-003', client: 'Initech', amount: '₹3,456', status: 'Overdue', date: '2024-03-13' },
]

const recentWeightTickets = [
  { id: 'WT-001', truck: 'TRK-123', weight: '25,000 kg', date: '2024-03-15' },
  { id: 'WT-002', truck: 'TRK-456', weight: '30,000 kg', date: '2024-03-14' },
  { id: 'WT-003', truck: 'TRK-789', weight: '28,000 kg', date: '2024-03-13' },
]

export default function DashboardPage() {
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
                          {invoice.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.client}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.amount}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.status}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                          {ticket.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.truck}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.weight}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 