import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { attendanceService } from '../services/attendanceService';
import { dashboardService } from '../services/dashboard.service';
import { AttendanceRecord } from '../types/attendance';
import { AttendanceSummary } from '../types/dashboard';
import AttendanceCard from '../components/AttendanceCard';
import { SummaryCard } from '../components/SummaryCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
      setError('Failed to load attendance data. Please try again.');
    }
  }, []);

  // Refresh data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
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
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchData();
    setLoading(false);
  }, [fetchData]);

  // ── Loading State ──
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.7}>
          <Ionicons name="refresh" size={18} color={colors.white} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── List Header (Summary) ──
  const ListHeader = () => (
    <View>
      {summary && <SummaryCard summary={summary} />}

      <Text style={styles.sectionTitle}>Attendance Records</Text>
    </View>
  );

  // ── Empty State ──
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={48} color={colors.disabled} />
      <Text style={styles.emptyText}>No attendance records yet.</Text>
    </View>
  );

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <AttendanceCard record={item} />}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={EmptyList}
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.xs,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});