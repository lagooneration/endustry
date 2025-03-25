'use client'

import { PrinterIcon } from '@heroicons/react/24/outline'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 print:hidden"
    >
      <PrinterIcon className="-ml-1 mr-2 h-5 w-5" />
      Print / Download PDF
    </button>
  )
}