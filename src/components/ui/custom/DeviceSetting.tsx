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
import DeviceSettingForm from "@/components/forms/DeviceSettingForm";
import { readDeviceSetting, getDeviceSetting } from "@/actions/thingsboard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DeviceSettingProps {
  deviceId?: string;
  onSettingsSaved: () => void;
}

export function DeviceSetting({ deviceId, onSettingsSaved }: DeviceSettingProps) {
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [weight, setWeight] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (deviceId) {
          const device = await getDeviceSetting(deviceId);
          if (device) {
            setEntityType(device.entityType);
            setEntityId(device.entityId);
            if (device.entityId) {
              onSettingsSaved();
            }
          }
        } else {
          const result = await readDeviceSetting();
          if (result) {
            setEntityType(result.entityType);
            setEntityId(result.entityId);
            if (result.entityId) {
              onSettingsSaved();
            }
          }
        }
      } catch (error) {
        console.error('Error loading device data:', error);
      }
    }
    loadData();
  }, [deviceId, onSettingsSaved, entityId]);

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
            {weight !== null && (
              <Card className="p-4 mb-4">
                <h3 className="font-medium mb-2">Current Weight</h3>
                <p className="text-2xl font-bold">{weight} kg</p>
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
        <DeviceSettingForm />
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