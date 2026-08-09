// components/AttendanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceSummary } from '../types/attendance';

export default function AttendanceCard({ summary }: { summary: AttendanceSummary }) {
  const isLow = summary.percentage < 75;

  return (
    <View style={styles.card}>
      <Text style={styles.subject}>{summary.subjectName}</Text>
      <Text style={styles.count}>{summary.present}/{summary.total} classes attended</Text>
      <Text style={[styles.percentage, { color: isLow ? '#d32f2f' : '#2e7d32' }]}>
        {summary.percentage.toFixed(1)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  subject: { fontSize: 16, fontWeight: '600' },
  count: { fontSize: 13, color: '#666', marginTop: 4 },
  percentage: { fontSize: 20, fontWeight: '700', marginTop: 8 },
});