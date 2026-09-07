export interface AttendanceRecord {
  id: number;
  sessionId: number;
  subject: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  deviceId: string | null;
}

// Alias kept for backward-compatibility with service return types
export type AttendanceResponse = AttendanceRecord;