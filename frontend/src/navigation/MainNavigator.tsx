import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';

import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ProfileScreen from '../screens/ProfileScreen';

import TeacherDashboardScreen from '../screens/TeacherDashboardScreen';
import StartSessionScreen from '../screens/StartSessionScreen';
import TeacherSessionsScreen from '../screens/TeacherSessionsScreen';
import SessionAttendanceScreen from '../screens/SessionAttendanceScreen';
import MarkAttendanceScreen from '../screens/MarkAttendanceScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  const { user } = useAuth();

  if (user?.role === 'TEACHER') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherDashboardScreen}
          options={{ title: 'Teacher Dashboard' }}
        />
        <Stack.Screen
          name="StartSession"
          component={StartSessionScreen}
          options={{ title: 'Start Session' }}
        />
        <Stack.Screen
          name="TeacherSessions"
          component={TeacherSessionsScreen}
          options={{ title: 'My Sessions' }}
        />
        <Stack.Screen
          name="SessionAttendance"
          component={SessionAttendanceScreen}
          options={{ title: 'Session Attendance' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: 'My Attendance' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="MarkAttendance"
        component={MarkAttendanceScreen}
        options={{ title: 'Mark Attendance' }}
      />
    </Stack.Navigator>
  );
}