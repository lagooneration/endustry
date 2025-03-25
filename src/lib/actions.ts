'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from './useauth'
import { revalidatePath } from 'next/cache'
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return customers
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to fetch customers')
  }
}

export async function createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
  try {
    const customer = await prisma.customer.create({
      data
    })
    revalidatePath('/customers')
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function updateCustomer(id: string, data: Partial<Omit<Customer, 'id'>>): Promise<Customer> {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data
    })
    revalidatePath('/customers')
    return customer
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await prisma.customer.delete({
      where: { id }
    })
    revalidatePath('/customers')
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        items: true,
        weightTickets: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    return invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw new Error('Failed to fetch invoices')
  }
}

const checkAuth = async () => {
  const session = await auth()
  if (!session) throw new Error('Not authenticated')
  return session
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
  await checkAuth()
  try {
    const invoice = await prisma.invoice.create({
      data: {
        number: data.number,
        customerId: data.customerId,
        date: data.date,
        dueDate: data.dueDate,
        notes: data.notes,
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

export async function createWeightTicket(data: {
  ticketNumber: string
  invoiceId: string
  date: Date
  truckNumber: string
  driverName: string
  grossWeight: number
  tareWeight: number
  netWeight: number
  notes?: string
}) {
  try {
    const weightTicket = await prisma.weightTicket.create({
      data
    })
    revalidatePath('/weight-tickets')
    return weightTicket
  } catch (error) {
    console.error('Error creating weight ticket:', error)
    throw new Error('Failed to create weight ticket')
  }
}

export async function getWeightTickets() {
  try {
    const weightTickets = await prisma.weightTicket.findMany({
      include: {
        invoice: {
          include: {
            customer: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    return weightTickets
  } catch (error) {
    console.error('Error fetching weight tickets:', error)
    throw new Error('Failed to fetch weight tickets')
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/invoices')
  return invoice
}

export async function deleteInvoice(id: string) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  await prisma.invoice.delete({
    where: { id },
  })

  revalidatePath('/invoices')
} 

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
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

