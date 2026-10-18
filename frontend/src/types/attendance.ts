export interface AttendanceRecord {
  id: number;
  sessionId: number;
  subject: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  deviceId: string | null;
  studentName?: string;
  studentEmail?: string;
}

// Alias kept for backward-compatibility with service return types
export type AttendanceResponse = AttendanceRecord;

export interface SubjectAttendanceSummary {
  name: string;
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
}

export interface AttendanceSummaryResponse {
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
  subjects?: SubjectAttendanceSummary[];
}