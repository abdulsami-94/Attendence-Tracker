import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  Profile: undefined;

  TeacherDashboard: undefined;
  StartSession: undefined;
  TeacherSessions: undefined;
  SessionAttendance: { sessionId: number };
  MarkAttendance: { sessionToken: string; sessionId: number };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};