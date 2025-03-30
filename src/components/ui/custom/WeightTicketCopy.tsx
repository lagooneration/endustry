'use client'

import { format } from 'date-fns'

interface WeightTicketCopyProps {
  weightTicket: any
  copyType: string
}

export function WeightTicketCopy({ weightTicket, copyType }: WeightTicketCopyProps) {
  return (
    <div className="ticket-copy p-6 border-2 border-dashed border-gray-300 mb-8 print:mb-16 print:border-solid">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">WEIGHT MEASUREMENT TICKET</h2>
        <p className="text-sm text-gray-600 mt-1">{copyType} COPY</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <img src="/company-logo.png" alt="Company Logo" className="h-12 w-auto" />
          <h3 className="font-bold mt-2">Your Company Name</h3>
          <p className="text-sm text-gray-600">Address Line 1</p>
          <p className="text-sm text-gray-600">City, State, PIN</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">#{weightTicket.ticketNumber}</p>
          <p className="text-sm text-gray-600">
            Date: {format(new Date(weightTicket.date), 'dd/MM/yyyy')}
          </p>
          <p className="text-sm text-gray-600">
            Time: {format(new Date(weightTicket.date), 'HH:mm')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-r pr-4">
          <h4 className="font-semibold mb-2">Vehicle Details</h4>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Truck No:</span> {weightTicket.truckNumber}
            </p>
            <p className="text-sm">
              <span className="font-medium">Driver:</span> {weightTicket.driverName}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Customer Details</h4>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Name:</span> {weightTicket.customer.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span> {weightTicket.customer.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Gross Weight</p>
            <p className="text-xl font-bold">{weightTicket.grossWeight.toLocaleString()} kg</p>
          </div>
          <div className="border-x px-4">
            <p className="text-sm text-gray-600">Tare Weight</p>
            <p className="text-xl font-bold">{weightTicket.tareWeight.toLocaleString()} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Weight</p>
            <p className="text-xl font-bold text-indigo-700">{weightTicket.netWeight.toLocaleString()} kg</p>
          </div>
        </div>
      </div>

      {weightTicket.notes && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Notes</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
            {weightTicket.notes}
          </p>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="mb-8">Operator Signature</div>
          <p className="text-sm text-gray-600">Authorized Signatory</p>
        </div>
        <div className="text-center">
          <div className="mb-8">Customer/Driver Signature</div>
          <p className="text-sm text-gray-600">Received By</p>
        </div>
      </div>
    </div>
  )
}