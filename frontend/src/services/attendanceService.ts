import api from './api';
import { AttendanceSummary } from '../types/attendance';

export const getAttendanceSummary = async (studentId: number): Promise<AttendanceSummary[]> => {
  const res = await api.get(`/attendance/summary/${studentId}`);
  return res.data;
};