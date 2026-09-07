import { get, post } from './api';
import { AttendanceResponse } from '../types/attendance';

export const attendanceService = {

  getMyAttendance: async (): Promise<AttendanceResponse[]> => {
    return await get<AttendanceResponse[]>('/attendance/mine');
  },

  getRecordsForSession: async (sessionId: number): Promise<AttendanceResponse[]> => {
    return await get<AttendanceResponse[]>(`/attendance/records?sessionId=${sessionId}`);
  },

  markAttendance: async (data: {
    token: string;
    sessionId: number;
    latitude: number;
    longitude: number;
    deviceId?: string;
  }): Promise<AttendanceResponse> => {
    return await post<AttendanceResponse>('/attendance', data);
  },
};