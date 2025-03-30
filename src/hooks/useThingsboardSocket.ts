import { useState, useEffect } from 'react';
import { loginTb, readSetting } from '@/actions/thingsboard';

interface ThingsboardData {
  weight: number;
  isConnected: boolean;
  error: string | null;
}

export function useThingsboardSocket() {
  const [tbData, setTbData] = useState<ThingsboardData>({
    weight: 0,
    isConnected: false,
    error: null
  });

  useEffect(() => {
    let webSocket: WebSocket | null = null;

    async function connectToThingsboard() {
      try {
        const login = await loginTb();
        const setting = await readSetting();

        if (setting?.data?.[0] && login.token) {
          const { entityType, entityId } = setting.data[0];
          webSocket = new WebSocket(process.env.NEXT_PUBLIC_TB_WS_URL || "");

          webSocket.onopen = () => {
            setTbData(prev => ({ ...prev, isConnected: true }));
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
            webSocket?.send(JSON.stringify(object));
          };

          webSocket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            if (receivedData.data?.weight?.[0]?.[1]) {
              setTbData(prev => ({
                ...prev,
                weight: receivedData.data.weight[0][1]
              }));
            }
          };

          webSocket.onclose = () => {
            setTbData(prev => ({ ...prev, isConnected: false }));
            console.log("ThingsBoard connection closed!");
          };

          webSocket.onerror = (error) => {
            setTbData(prev => ({ 
              ...prev, 
              isConnected: false,
              error: "Connection error with ThingsBoard"
            }));
            console.error("ThingsBoard WebSocket error:", error);
          };
        }
      } catch (error) {
        setTbData(prev => ({ 
          ...prev, 
          error: "Failed to connect to ThingsBoard"
        }));
        console.error("ThingsBoard connection error:", error);
      }
    }

    connectToThingsboard();

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  return tbData;
}