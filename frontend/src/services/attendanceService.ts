import { get, post } from './api';
import { AttendanceResponse, AttendanceSummaryResponse } from '../types/attendance';

export const attendanceService = {

  getAttendanceSummary: async (): Promise<AttendanceSummaryResponse> => {
    return await get<AttendanceSummaryResponse>('/attendance/summary');
  },

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