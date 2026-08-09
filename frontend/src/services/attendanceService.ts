import { get } from './api';
import { AttendanceRecord } from '../types/attendance';

export const attendanceService = {
  /**
   * Fetch the logged-in student's attendance records.
   * Backend: GET /api/attendance/mine
   * Auth: JWT attached automatically by the API request interceptor.
   */
  getMyAttendance: async (): Promise<AttendanceRecord[]> => {
    return await get<AttendanceRecord[]>('/attendance/mine');
  },
};