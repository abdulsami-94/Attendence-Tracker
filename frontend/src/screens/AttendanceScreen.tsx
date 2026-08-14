import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { attendanceService } from '../services/attendanceService';
import { dashboardService } from '../services/dashboard.service';
import { AttendanceRecord } from '../types/attendance';
import { AttendanceSummary } from '../types/dashboard';
import AttendanceCard from '../components/AttendanceCard';
import { SummaryCard } from '../components/SummaryCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);

  const fetchData = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;

    try {
      setError(null);
      const [attendanceRecords, dashboardData] = await Promise.all([
        attendanceService.getMyAttendance(),
        dashboardService.getDashboardData(),
      ]);
      setRecords(attendanceRecords);
      setSummary(dashboardData.attendanceSummary);
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError(getErrorMessage(err));
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  // Refresh data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        if (requestInFlight.current) {
          return;
        }

        setLoading(true);
        await fetchData();
        if (isActive) {
          setLoading(false);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [fetchData])
  );

  const onRefresh = useCallback(async () => {
    if (loading || refreshing || requestInFlight.current) {
      return;
    }

    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData, loading, refreshing]);

  const handleRetry = useCallback(async () => {
    if (loading || requestInFlight.current) {
      return;
    }

    setLoading(true);
    setError(null);
    await fetchData();
    setLoading(false);
  }, [fetchData, loading]);

  // ── Loading State ──
  if (loading) {
    return <LoadingState message="Loading attendance records..." />;
  }

  // ── Error State ──
  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  // ── List Header (Summary) ──
  const ListHeader = () => (
    <View>
      {summary && <SummaryCard summary={summary} />}

      <Text style={styles.sectionTitle}>Attendance Records</Text>
    </View>
  );

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <AttendanceCard record={item} />}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={<EmptyState message="No attendance records yet." icon="calendar-outline" />}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
      style={styles.container}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
});