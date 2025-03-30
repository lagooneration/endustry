'use client'
import { useEffect, useState } from 'react';
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingForm } from "@/components/forms/SettingForm";
import { readSetting, getDevices } from "@/actions/thingsboard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Device } from '@/types/device';

interface SettingModalProps {
  deviceId?: string;
}

export function SettingModal({ deviceId }: SettingModalProps) {
  const [deviceData, setDeviceData] = useState<Device | null>(null);
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [keys, setKeys] = useState("");
  const [useStrictDataTypes, setUseStrictDataTypes] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        if (deviceId) {
          const device = await getDevices(deviceId);
          if (device) {
            setDeviceData(device as Device);
            setEntityType(device.entityType);
            setEntityId(device.entityId);
            setKeys(device.keys || "");
            setUseStrictDataTypes(device.useStrictDataTypes ? "true" : "false");
          }
        } else {
          const result = await readSetting();
          if (result.data?.[0]) {
            setEntityType(result.data[0].entityType);
            setEntityId(result.data[0].entityId);
            setKeys(result.data[0].keys || "");
            setUseStrictDataTypes(result.data[0].useStrictDataTypes ? "true" : "false");
          }
        }
      } catch (error) {
        console.error('Error loading device data:', error);
      }
    }
    loadData();
  }, [deviceId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="gap-1">
          <Icons.setting className="h-5 w-5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[700px]">
        <DialogHeader>
          <DialogTitle>Device Settings</DialogTitle>
          <DialogDescription>
            {deviceData && (
              <Card className="p-4 mb-4">
                <h3 className="font-medium mb-2">Current Device Parameters</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p>{deviceData.lastTelemetry?.weight ? `${deviceData.lastTelemetry.weight} kg` : 'No data'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p>{deviceData.status}</p>
                  </div>
                </div>
              </Card>
            )}
            <p>Adjust your telemetry settings to connect to ThingsBoard:</p>
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex gap-1">
                <h1>EntityType:</h1>
                <Badge>{entityType ? entityType : "NA"}</Badge>
              </div>
              <div className="flex gap-1">
                <h1>EntityId:</h1>
                <Badge>{entityId ? entityId : "NA"}</Badge>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <SettingForm deviceId={deviceId} />
        <DialogFooter>
          <DialogClose asChild className="w-full">
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}