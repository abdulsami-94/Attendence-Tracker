import { get, post } from './api';

export interface SubjectOption {
  id: number;
  name: string;
  hasTheory: boolean;
  hasLab: boolean;
}

export interface Session {
  id: number;
  subject: string;
  roomNumber: string;
  active: boolean;
  startTime: string;
  expiryTime: string;
  currentToken: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  sessionType?: 'THEORY' | 'LAB';
  subjectId?: number;
}

export interface StartSessionRequest {
  subjectId: number;
  sessionType: 'THEORY' | 'LAB';
  latitude: number;
  longitude: number;
  roomNumber?: string;
  durationMinutes?: number;
  radiusMeters?: number;
}

export const sessionService = {
  startSession: async (data: StartSessionRequest): Promise<Session> => {
    return await post<Session>('/sessions', data);
  },

  endSession: async (id: number): Promise<Session> => {
    return await post<Session>(`/sessions/${id}/end`);
  },

  getMySessions: async (): Promise<Session[]> => {
    return await get<Session[]>('/sessions/mine');
  },

  getCurrentSession: async (): Promise<Session> => {
    return await get<Session>('/sessions/current');
  },

  getSubjects: async (): Promise<SubjectOption[]> => {
    return await get<SubjectOption[]>('/subjects');
  },
};