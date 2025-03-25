import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    path: '/api/websocket',
    addTrailingSlash: false,
  })

  io.on('connection', (socket) => {
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

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
}) 