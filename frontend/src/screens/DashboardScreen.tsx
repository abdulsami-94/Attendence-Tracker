import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { attendanceService } from '../services/attendanceService';
import { AttendanceSummaryResponse } from '../types/attendance';
import { MainStackParamList } from '../types/navigation';
import { StudentCard } from '../components/StudentCard';
import { SummaryCard } from '../components/SummaryCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { LoadingState } from '../components/LoadingState';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useActiveSession } from '../hooks/useActiveSession';

type DashboardNavProp = NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavProp>();
  const { user, signOut, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<AttendanceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);
  const { session: activeSession, refresh: refreshActiveSession } = useActiveSession();

  const fetchSummary = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;

    try {
      setError(null);
      const response = await attendanceService.getAttendanceSummary();
      setSummary(response);
    } catch (err) {
      console.error('Attendance summary fetch error:', err);
      setError(getErrorMessage(err));
      setSummary(null);
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchSummary();
    setLoading(false);
  }, [fetchSummary]);

  const onRefresh = useCallback(async () => {
    if (loading || refreshing || requestInFlight.current) {
      return;
    }

    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary, loading, refreshing]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Bug #4 fix: when returning from MarkAttendanceScreen the live-session banner
  // should disappear immediately, not after the next 10-second poll interval.
  useFocusEffect(
    useCallback(() => {
      refreshActiveSession();
    }, [refreshActiveSession])
  );

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  if (!user && authLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name || 'Student'}</Text>
        </View>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>

      {activeSession && (
        <TouchableOpacity
          style={styles.liveSessionCard}
          onPress={() =>
            navigation.navigate('MarkAttendance', {
              sessionToken: activeSession.currentToken,
              sessionId: activeSession.id,
            })
        }
        >
          <Text style={styles.liveSessionText}>
            🟢 {activeSession.subject} is live — tap to check in
          </Text>
        </TouchableOpacity>
      )}

      <StudentCard student={user} />
      
      <SummaryCard summary={summary} loading={loading} error={!!error} />

      {/* Subject Breakdown Card */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Subject Breakdown</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.md }} />
        ) : error || !summary ? (
          <Text style={styles.breakdownPlaceholder}>—</Text>
        ) : (() => {
          const filtered = (summary.subjects ?? []).filter((item) => item.totalSessions > 0);
          if (filtered.length === 0) {
            return <Text style={styles.breakdownPlaceholder}>No sessions yet</Text>;
          }
          return filtered.map((item) => (
            <View key={item.name} style={styles.subjectRow}>
              <Text style={styles.subjectRowText}>
                {item.name}: total {item.totalSessions}, present {item.attendedSessions}
              </Text>
              <Text style={styles.subjectPercentageText}>{item.percentage}%</Text>
            </View>
          ));
        })()}
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <QuickActionButton 
            title="Attendance" 
            icon="calendar-outline" 
            onPress={() => navigation.navigate('Attendance')} 
          />
          <QuickActionButton 
            title="Timetable" 
            icon="time-outline" 
            color={colors.warning}
            onPress={() => Alert.alert('Coming Soon', 'The Timetable feature is not available yet.')} 
          />
          <QuickActionButton 
            title="Profile" 
            icon="person-outline" 
            color={colors.secondary}
            onPress={() => navigation.navigate('Profile')} 
          />
          <QuickActionButton 
            title={authLoading ? 'Logging out' : 'Logout'}
            icon="log-out-outline" 
            color={colors.error}
            onPress={signOut}
            disabled={authLoading}
            loading={authLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  liveSessionCard: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  liveSessionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  breakdownPlaceholder: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}40`,
  },
  subjectRowText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  subjectPercentageText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
