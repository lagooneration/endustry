import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface WeightUpdate {
  weight: number
  timestamp: string
}

export function useWeightSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [weight, setWeight] = useState<number>(0)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    const newSocket = io({
      path: '/api/websocket',
      addTrailingSlash: false,
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    newSocket.on('weight-update', (data: WeightUpdate) => {
      setWeight(data.weight)
      setLastUpdate(data.timestamp)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return { weight, lastUpdate }
} 