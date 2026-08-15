import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { attendanceService } from '../services/attendanceService';
import { AttendanceRecord } from '../types/attendance';
import { MainStackParamList } from '../types/navigation';
import AttendanceCard from '../components/AttendanceCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type SessionAttendanceRouteProp = RouteProp<
  MainStackParamList,
  'SessionAttendance'
>;

export default function SessionAttendanceScreen() {
  const route = useRoute<SessionAttendanceRouteProp>();
  const { sessionId } = route.params;

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchRecords = useCallback(async () => {
    try {
      setError('');
      const data = await attendanceService.getRecordsForSession(sessionId);
      setRecords(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [sessionId]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    await fetchRecords();
    setLoading(false);
  }, [fetchRecords]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecords();
    setRefreshing(false);
  }, [fetchRecords]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  if (loading) {
    return <LoadingState message="Loading attendance records..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadRecords} />;
  }

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <AttendanceCard record={item} />}
      style={styles.container}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        <EmptyState
          message="No attendance records found for this session."
          icon="people-outline"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});