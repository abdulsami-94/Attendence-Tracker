// screens/AttendanceScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { getAttendanceSummary } from '../services/attendanceService';
import { AttendanceSummary } from '../types/attendance';
import AttendanceCard from '../components/AttendanceCard';

export default function AttendanceScreen({ studentId }: { studentId: number }) {
  const [data, setData] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAttendanceSummary(studentId)
      .then(setData)
      .catch(() => setError('Could not load attendance. Try again.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  if (!data.length) return <Text style={{ textAlign: 'center', marginTop: 40 }}>No attendance records yet.</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.subjectId.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <AttendanceCard summary={item} />}
    />
  );
}