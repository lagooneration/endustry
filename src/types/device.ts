export interface Device {
    id: string;
    name: string;
    entityType: string;
    entityId: string;
    status: string;
    lastConnected: string | null; // Change from Date to string
    lastTelemetry: {
      weight?: number;
      [key: string]: any;
    } | null;
    keys: string | null;
    useStrictDataTypes: boolean;
    createdAt: string; // Change from Date to string
    updatedAt: string; // Change from Date to string
    userId: string;
  }