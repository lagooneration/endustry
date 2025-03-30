'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { createSetting } from '@/actions/thingsboard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SettingModal } from '@/components/ui/custom/SettingModal'

export default function NewDevicePage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [entityType, setEntityType] = useState('DEVICE')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      entityType: entityType,
      entityId: formData.get('entityId') as string,
    }

    try {
      const result = await createSetting(data)
      if (result.error) {
        throw result.error
      }
      router.push('/devices')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create device')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/devices"
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">New Device</h1>
        </div>
        <SettingModal />
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Device Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1"
                placeholder="Enter device name"
              />
            </div>

            <div>
              <Label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                Entity Type
              </Label>
              <Select
                value={entityType}
                onValueChange={setEntityType}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEVICE">Device</SelectItem>
                  <SelectItem value="ASSET">Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
                Entity ID
              </Label>
              <Input
                type="text"
                name="entityId"
                id="entityId"
                required
                className="mt-1"
                placeholder="Enter ThingsBoard entity ID"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/devices')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Device'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
