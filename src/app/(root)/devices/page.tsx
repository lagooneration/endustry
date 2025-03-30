"use client"
import { Card } from '@/components/ui/card'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getDevices, deleteDeviceSetting } from '@/actions/thingsboard'
import { SettingModal } from '@/components/ui/custom/SettingModal'
import { useEffect, useState } from 'react'
import { CardSkeleton } from '@/components/ui/custom/CardSkeleton'
import type { Device } from '@/types/device'
import { useThingsboardSocket } from '@/hooks/useThingsboardSocket'
import { useScaleSocket } from '@/hooks/useScaleSocket'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function DevicesPage() {
  const [devicesList, setDevicesList] = useState<Device[]>([])  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const tbData = useThingsboardSocket();
  const scaleData = useScaleSocket();

  useEffect(() => {
    async function loadDevices() {
      try {
        const devices = await getDevices()
        setDevicesList(devices || [])
      } catch (err) {
        console.error('Failed to load devices:', err)
        setError('Failed to load devices')
      } finally {
        setLoading(false)
      }
    }
    loadDevices()
  }, [])

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteDeviceSetting(deviceToDelete);
      
      if (result.success) {
        setDevicesList(prevDevices => 
          prevDevices.filter(device => device.id !== deviceToDelete)
        );
        toast({
          title: "Device deleted",
          description: "The device has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to delete device",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Failed to delete device:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the device.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeviceToDelete(null);
    }
  };

  if (loading) return <CardSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
        <div className="flex gap-2">
          {/* <SettingModal /> */}
          <Link
            href="/devices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Device
          </Link>
        </div>
      </div>

      {devicesList.map((device) => (
        <div key={device.id}>
          <Card className="mb-4 p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{device.name}</h2>
                <p className="text-gray-500">ID: {device.entityId}</p>
              </div>
              <div className="flex gap-2">
                <SettingModal deviceId={device.id} />
                <Link
                  href={`/devices/${device.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeviceToDelete(device.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Last Connected</h3>
                <p>{device.lastConnected ? new Date(device.lastConnected).toLocaleString() : 'Never'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Latest Weight</h3>
                <p>{device.lastTelemetry?.weight ? `${device.lastTelemetry.weight} kg` : 'No data'}</p>
              </div>
            </div>
          </Card>
          <Card className="mb-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold">Local Scale Data</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-500">Weight: {scaleData.weight} KG</p>
                  <p className="text-gray-500">
                    Status: {scaleData.isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-gray-500">
                    Stability: {scaleData.isStable ? 'Stable' : 'Unstable'}
                  </p>
                  {scaleData.error && (
                    <p className="text-red-500">Error: {scaleData.error}</p>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">ThingsBoard Data</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-500">Weight: {tbData.weight} KG</p>
                  <p className="text-gray-500">
                    Status: {tbData.isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                  {tbData.error && (
                    <p className="text-red-500">Error: {tbData.error}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}

      {devicesList.length === 0 && (
        <Card className="p-6 text-center text-gray-500">
          No devices found. Add a new device to get started.
        </Card>
      )}

      <AlertDialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this device?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the device
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDevice} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
