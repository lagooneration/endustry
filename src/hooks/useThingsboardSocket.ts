import { useState, useEffect } from 'react';
import { loginTb, readDeviceSetting } from '@/actions/thingsboard';

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
    let reconnectTimeout: NodeJS.Timeout;

    async function connectToThingsboard() {
      try {
        const login = await loginTb();
        const setting = await readDeviceSetting();

        if (setting && login.token) {
          const { entityType, entityId } = setting;
          const wsUrl = process.env.NEXT_PUBLIC_TB_WS_URL || "";
          webSocket = new WebSocket(wsUrl);

          webSocket.onopen = () => {
            setTbData(prev => ({ ...prev, isConnected: true, error: null }));
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
          isConnected: false,
          error: "Failed to connect to ThingsBoard"
        }));
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeout = setTimeout(connectToThingsboard, 5000);
      }
    }

    connectToThingsboard();

    return () => {
      webSocket?.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  return tbData;
}