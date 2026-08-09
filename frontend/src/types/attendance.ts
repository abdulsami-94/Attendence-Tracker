/**
 * Matches the backend AttendanceResponse DTO returned by GET /api/attendance/mine.
 *
 * Fields: id, sessionId, subject, timestamp, latitude, longitude, deviceId
 */
export interface AttendanceRecord {
  id: number;
  sessionId: number;
  subject: string;
  timestamp: string; // ISO 8601 datetime string from backend (LocalDateTime serialised)
  latitude: number | null;
  longitude: number | null;
  deviceId: string | null;
}