import { Server } from 'socket.io'
import { NextResponse } from 'next/server'

const ioHandler = (req: Request) => {
  if (!global.io) {
    console.log('Initializing Socket.IO server...')
    global.io = new Server({
      path: '/api/websocket',
      addTrailingSlash: false,
    })

    global.io.on('connection', (socket) => {
      console.log('Client connected')

      // Simulate weight data updates (replace with actual scale integration)
      const interval = setInterval(() => {
        const weight = Math.floor(Math.random() * 10000) + 20000 // Random weight between 20000-30000 kg
        socket.emit('weight-update', {
          weight,
          timestamp: new Date().toISOString(),
        })
      }, 1000) // Update every second

      socket.on('disconnect', () => {
        console.log('Client disconnected')
        clearInterval(interval)
      })
    })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

export const GET = ioHandler 