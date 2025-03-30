import { createWeightTicket } from '@/lib/actions'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Ensure weight values are numbers
    const weightTicketData = {
      ...data,
      grossWeight: Number(data.grossWeight),
      tareWeight: Number(data.tareWeight),
      netWeight: Number(data.netWeight),
      date: new Date(data.date)
    }

    const weightTicket = await createWeightTicket(weightTicketData)
    return NextResponse.json(weightTicket)
  } catch (error) {
    console.error('Error creating weight ticket:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create weight ticket' },
      { status: 500 }
    )
  }
}