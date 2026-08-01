import { get } from './api';
import { DashboardData } from '../types/dashboard';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    return await get<DashboardData>('/dashboard');
  },
};
