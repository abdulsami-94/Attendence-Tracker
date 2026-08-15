import { get } from './api';
import { AttendanceRecord } from '../types/attendance';

export const attendanceService = {

  getMyAttendance: async (): Promise<AttendanceRecord[]> => {
    return await get<AttendanceRecord[]>('/attendance/mine');
  },

  getRecordsForSession: async (sessionId: number): Promise<AttendanceRecord[]> => {
    return await get<AttendanceRecord[]>(`/attendance/records?sessionId=${sessionId}`);
  },
};