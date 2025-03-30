"use client"
import { Card } from '@/components/ui/card'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { readDeviceSetting, loginTb } from '@/actions/thingsboard'
import { DeviceSetting } from '@/components/ui/custom/DeviceSetting'
import { useEffect, useState } from 'react'
import { CardSkeleton } from '@/components/ui/custom/CardSkeleton'
import type { Device } from '@/types/device'
import { useThingsboardSocket } from '@/hooks/useThingsboardSocket'

export default function DevicePage() {
  const [devicesList, setDevicesList] = useState<Device[]>([])  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeviceData, setShowDeviceData] = useState(false)
  const [weight, setWeight] = useState<number | null>(null)

  const tbData = useThingsboardSocket();

  useEffect(() => {
    // Check if we have a valid connection on mount
    async function checkConnection() {
      try {
        const login = await loginTb();
        const setting = await readDeviceSetting();
        
        if (setting && login.token) {
          const { entityType, entityId } = setting;
          setShowDeviceData(true);
          
          const wsUrl = process.env.NEXT_PUBLIC_TB_WS_URL;
          if (!wsUrl) {
            throw new Error("WebSocket URL not configured");
          }

          const webSocket = new WebSocket(wsUrl);

          webSocket.onopen = () => {
            const object = {
              authCmd: {
                cmdId: 0,
                token: login.token,
              },
              cmds: [
                {
                  entityType,
                  entityId,
                  scope: "LATEST_TELEMETRY",
                  cmdId: 10,
                  type: "TIMESERIES",
                },
              ],
            };
            webSocket.send(JSON.stringify(object));
          };

          webSocket.onmessage = (event) => {
            try {
              const receivedData = JSON.parse(event.data);
              if (receivedData.data?.weight?.[0]?.[1]) {
                setWeight(receivedData.data.weight[0][1]);
              }
            } catch (e) {
              console.error("Error parsing WebSocket message:", e);
            }
          };

          webSocket.onclose = () => {
            console.log("Connection closed!");
          };

          webSocket.onerror = (err) => {
            console.error("WebSocket error:", err);
            setError("Connection error with ThingsBoard");
          };

          return () => {
            webSocket.close();
          };
        }
      } catch (error) {
        console.error("Connection error:", error);
        setError(error instanceof Error ? error.message : "Failed to connect");
      } finally {
        setLoading(false);
      }
    }
    
    checkConnection();
  }, []);

  useEffect(() => {
    if (tbData.weight) {
      setWeight(tbData.weight);
    }
  }, [tbData.weight]);

  if (loading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Device</h1>
        <div className="flex gap-2">
          <DeviceSetting onSettingsSaved={() => setShowDeviceData(true)} />
        </div>
      </div>

      {showDeviceData && (
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Current Weight</h2>
              <p className="text-4xl font-bold">{weight ?? 'No data'} kg</p>
              {tbData.error && (
                <p className="text-red-500 mt-2">{tbData.error}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {devicesList.length === 0 && !showDeviceData && (
        <Card className="p-6 text-center text-gray-500">
          No devices found. Add a new device to get started.
        </Card>
      )}
    </div>
  )
}
