'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Helper function to check authentication
const checkAuth = async () => {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')
  return session.user.id
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

// Customer actions
export async function getCustomers() {
  const userId = await checkAuth()
  
  return prisma.customer.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  })
}

export async function createCustomer(data: {
  name: string
  email: string
  phone: string
  address: string
}) {
  const userId = await checkAuth()

  try {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        userId
      }
    })
    
    revalidatePath('/customers') // Add this line to revalidate the customers page
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function updateCustomer(id: string, data: Partial<Omit<Customer, 'id'>>) {
  const userId = await checkAuth()

  try {
    const customer = await prisma.customer.update({
      where: { 
        id,
        userId // Ensure user can only update their own customers
      },
      data
    })
    revalidatePath('/customers')
    return customer
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

export async function deleteCustomer(id: string) {
  const userId = await checkAuth()

  try {
    await prisma.customer.delete({
      where: { 
        id,
        userId // Ensure user can only delete their own customers
      }
    })
    revalidatePath('/customers')
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}

// Invoice actions
export async function getInvoices() {
  const userId = await checkAuth()

  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        customer: true,
        items: true,
        weightTickets: true
      },
      orderBy: { date: 'desc' }
    })
    return invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw new Error('Failed to fetch invoices')
  }
}

export async function createInvoice(data: {
  number: string
  customerId: string
  date: Date
  dueDate: Date
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  notes?: string
}) {
  const userId = await checkAuth()

  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        userId,
        total: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
        items: {
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        customer: true,
        items: true
      }
    })
    revalidatePath('/invoices')
    return invoice
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw new Error('Failed to create invoice')
  }
}

export async function getInvoiceById(id: string) {
  const userId = await checkAuth()

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { 
        id,
        userId // Ensure user can only view their own invoices
      },
      include: {
        customer: true,
        items: true,
        weightTickets: true
      }
    })
    
    if (!invoice) {
      throw new Error('Invoice not found')
    }

    return {
      ...invoice,
      date: invoice.date.toISOString(),
      dueDate: invoice.dueDate.toISOString()
    }
  } catch (error) {
    console.error('Error fetching invoice:', error)
    throw new Error('Failed to fetch invoice')
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  const userId = await checkAuth()

  const invoice = await prisma.invoice.update({
    where: { 
      id,
      userId // Ensure user can only update their own invoices
    },
    data: { status }
  })

  revalidatePath('/invoices')
  return invoice
}

export async function deleteInvoice(id: string) {
  const userId = await checkAuth()

  await prisma.invoice.delete({
    where: { 
      id,
      userId // Ensure user can only delete their own invoices
    }
  })

  revalidatePath('/invoices')
}

// Weight Ticket actions
export async function createWeightTicket(data: {
  ticketNumber: string
  customerId: string
  date: Date
  truckNumber: string
  driverName: string
  grossWeight: number
  tareWeight: number
  netWeight: number
  notes?: string
  invoiceId?: string
}) {
  const userId = await checkAuth()

  try {
    const weightTicket = await prisma.weightTicket.create({
      data: {
        ...data,
        userId
      },
      include: {
        customer: true,
        invoice: {
          include: {
            customer: true
          }
        }
      }
    })
    revalidatePath('/weight-tickets')
    return weightTicket
  } catch (error) {
    console.error('Error creating weight ticket:', error)
    throw new Error('Failed to create weight ticket')
  }
}

export async function getWeightTickets() {
  const userId = await checkAuth()

  try {
    const weightTickets = await prisma.weightTicket.findMany({
      where: { userId },
      include: {
        customer: true,
        invoice: {
          include: {
            customer: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })
    return weightTickets
  } catch (error) {
    console.error('Error fetching weight tickets:', error)
    throw new Error('Failed to fetch weight tickets')
  }
}

export async function getCustomerWeightTickets(customerId: string) {
  const userId = await checkAuth()

  return prisma.weightTicket.findMany({
    where: {
      userId,
      customerId,
    },
    orderBy: {
      date: 'desc'
    },
    include: {
      customer: true,
      invoice: true
    }
  })
}

// Get unassigned weight tickets (not linked to any invoice)
export async function getUnassignedWeightTickets(customerId: string) {
  const userId = await checkAuth()

  return prisma.weightTicket.findMany({
    where: {
      userId,
      customerId,
      invoiceId: null
    },
    orderBy: {
      date: 'desc'
    },
    include: {
      customer: true
    }
  })
}