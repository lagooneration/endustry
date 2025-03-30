'use server'
import axios from "@/config/axiosTb";
import { AxiosResponse } from "axios";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";


const checkAuth = async () => {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Not authenticated')
    return session.user.id
  }

type ResponseData = {
    token: string;
    refreshToken: string;
  };
  
  type LoginResult = {
    token?: string;
    refreshToken?: string;
    error?: Error;
  };
  

//THINGSBOARD
export async function loginTb(): Promise<LoginResult> {
    try {
      const username = process.env.TB_USERNAME;
      const password = process.env.TB_PASSWORD;
  
      if (!username || !password) {
        throw new Error(
          "The environment variables for the username and password are not defined."
        );
      }
  
      const responseLogin: AxiosResponse<ResponseData> = await axios.post(
        `/api/auth/login`,
        {
          username,
          password,
        }
      );
  
      const { token, refreshToken } = responseLogin.data;
      return { token, refreshToken };
    } catch (error) {
      return { error: error as Error };
    }
  }

//SETTING

export async function createSetting(data: {
    entityType: string;
    entityId: string;
    name: string;
  }) {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
  
      // First create/update device in Prisma
      const result = await prisma.device.create({
        data: {
          name: data.name,
          entityType: data.entityType,
          entityId: data.entityId,
          userId: session.user.id,
        }
      });
  
      // Get latest telemetry from ThingsBoard
      const loginResult = await loginTb();
      if (loginResult.error || !loginResult.token) {
        throw new Error("Failed to login to ThingsBoard");
      }
  
      // Configure axios with token
      axios.defaults.headers.common['X-Authorization'] = `Bearer ${loginResult.token}`;
      
      // Fetch telemetry from ThingsBoard
      const telemetryResponse = await axios.get(
        `/api/plugins/telemetry/${data.entityType}/${data.entityId}/values/timeseries?keys=weight`
      );
  
      // Update device with telemetry data
      if (telemetryResponse.data?.weight?.[0]?.value) {
        await prisma.device.update({
          where: { id: result.id },
          data: {
            lastTelemetry: { weight: telemetryResponse.data.weight[0].value },
            lastConnected: new Date(),
            status: 'online'
          }
        });
      }
      
      revalidatePath("/devices");
      return { data: result };
    } catch (error) {
      return { error: error as Error };
    }
  }
  
  export async function readSetting() {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
  
      const devices = await prisma.device.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { data: devices };
    } catch (error) {
      return { error: error as Error };
    }
  }


  export async function getDevices(deviceId?: string) {
    const userId = await checkAuth()
  
    try {
      if (deviceId) {
        const device = await prisma.device.findUnique({
          where: {
            id: deviceId,
            userId
          }
        });
  
        if (device) {
          const loginResult = await loginTb();
          if (loginResult.token) {
            axios.defaults.headers.common['X-Authorization'] = `Bearer ${loginResult.token}`;
            const telemetryResponse = await axios.get(
              `/api/plugins/telemetry/${device.entityType}/${device.entityId}/values/timeseries?keys=weight`
            );
  
            if (telemetryResponse.data?.weight?.[0]?.value) {
              const updatedDevice = await prisma.device.update({
                where: { id: device.id },
                data: {
                  lastTelemetry: { weight: telemetryResponse.data.weight[0].value },
                  lastConnected: new Date(),
                  status: 'online'
                }
              });
              
              // Serialize the dates to strings
              return {
                ...updatedDevice,
                lastConnected: updatedDevice.lastConnected?.toISOString() || null,
                createdAt: updatedDevice.createdAt.toISOString(),
                updatedAt: updatedDevice.updatedAt.toISOString()
              };
            }
          }
          // Serialize the dates if no telemetry update
          return {
            ...device,
            lastConnected: device.lastConnected?.toISOString() || null,
            createdAt: device.createdAt.toISOString(),
            updatedAt: device.updatedAt.toISOString()
          };
        }
        return null;
      }
  
      const devices = await prisma.device.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
  
      // Serialize all devices
      return devices.map(device => ({
        ...device,
        lastConnected: device.lastConnected?.toISOString() || null,
        createdAt: device.createdAt.toISOString(),
        updatedAt: device.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  export async function createDeviceSetting(data: { entityType: string; entityId: string }) {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      // First verify ThingsBoard connection
      const loginResult = await loginTb();
      if (loginResult.error || !loginResult.token) {
        throw new Error("Failed to login to ThingsBoard");
      }

      // Verify the device exists in ThingsBoard by trying to fetch its data
      axios.defaults.headers.common['X-Authorization'] = `Bearer ${loginResult.token}`;
      try {
        await axios.get(
          `/api/plugins/telemetry/${data.entityType}/${data.entityId}/values/timeseries?keys=weight`
        );
      } catch (error) {
        throw new Error("Device not found in ThingsBoard or invalid credentials");
      }

      // If ThingsBoard verification passes, create device setting
      const result = await prisma.deviceSetting.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          userId: session.user.id,
        },
      });

      revalidatePath("/");
      return { data: result };
    } catch (error) {
      console.error('Error creating device setting:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }
  
  export async function readDeviceSetting() {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const setting = await prisma.deviceSetting.findFirst({
        where: {
          userId: session.user.id,
        },
        orderBy: { 
          createdAt: "desc" 
        },
      });

      // Serialize the data before returning
      if (setting) {
        return {
          entityType: setting.entityType,
          entityId: setting.entityId,
          createdAt: setting.createdAt.toISOString(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error reading device setting:', error);
      return null;
    }
  }

  export async function getDeviceSetting(deviceId: string) {
    try {
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        select: {
          entityType: true,
          entityId: true
        }
      });
      
      return device;
    } catch (error) {
      console.error('Error fetching device setting:', error);
      throw error;
    }
  }

  export async function deleteDeviceSetting(deviceId: string) {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
  
      // First find the device to get ThingsBoard entityId
      const device = await prisma.device.findUnique({
        where: {
          id: deviceId,
          userId: session.user.id
        }
      });
  
      if (!device) {
        throw new Error("Device not found");
      }
  
      // Delete the device from Prisma
      await prisma.device.delete({
        where: {
          id: deviceId,
          userId: session.user.id
        }
      });
  
      // Also delete any associated device settings
      await prisma.deviceSetting.deleteMany({
        where: {
          entityId: device.entityId,
          userId: session.user.id
        }
      });
  
      revalidatePath("/devices");
      return { success: true };
    } catch (error) {
      console.error('Error deleting device:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }