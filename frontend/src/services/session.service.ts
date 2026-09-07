import { get, post, put } from './api';

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
}

export interface StartSessionRequest {
  subject: string;
}

export const sessionService = {
  startSession: async (data: StartSessionRequest): Promise<Session> => {
    return await post<Session>('/sessions', data);
  },

  endSession: async (id: number): Promise<Session> => {
    return await put<Session>(`/sessions/${id}/end`);
  },

  getMySessions: async (): Promise<Session[]> => {
    return await get<Session[]>('/sessions/mine');
  },

  getCurrentSession: async (): Promise<Session> => {
    return await get<Session>('/sessions/current');
  },
};