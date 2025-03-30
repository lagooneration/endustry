'use client';

import { useState, useEffect } from 'react';
import { createDeviceSetting, readDeviceSetting } from '@/actions/thingsboard';
import { DeviceSetting } from '@prisma/client';

interface DeviceSettingFormProps {
  onSuccess?: () => void;
}

export default function DeviceSettingForm({ onSuccess }: DeviceSettingFormProps) {
  const [entityType, setEntityType] = useState('DEVICE');
  const [entityId, setEntityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatestSetting();
  }, []);

  async function fetchLatestSetting() {
    try {
      const data = await readDeviceSetting();
      setEntityType(entityType);
      setEntityId(entityId);
    } catch (error) {
      console.error('Error fetching setting:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createDeviceSetting({ 
        entityType, 
        entityId 
      });

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        onSuccess?.();
        setEntityId('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Entity Type</label>
          <input
            type="text"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Entity ID</label>
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
            placeholder="Enter your ThingsBoard device ID"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Save Setting'}
        </button>
      </form>
    </div>
  );
}