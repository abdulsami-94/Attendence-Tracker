import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboard.service';
import { DashboardData } from '../types/dashboard';
import { MainStackParamList } from '../types/navigation';
import { StudentCard } from '../components/StudentCard';
import { SummaryCard } from '../components/SummaryCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type DashboardNavProp = NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavProp>();
  const { user, signOut, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;

    try {
      setError(null);
      const response = await dashboardService.getDashboardData();
      setData(response);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(getErrorMessage(err));
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  const loadData = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    setLoading(true);
    await fetchDashboardData();
    setLoading(false);
  }, [fetchDashboardData]);

  const onRefresh = useCallback(async () => {
    if (loading || refreshing || requestInFlight.current) {
      return;
    }

    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData, loading, refreshing]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
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
          <Text style={styles.nameText}>{user?.name || data?.student?.fullName || 'Student'}</Text>
        </View>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>

      {data ? (
        <>
          <StudentCard student={data.student} />
          
          <SummaryCard summary={data.attendanceSummary} />

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
                onPress={() => console.log('Timetable')} 
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
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState message="No dashboard data available" icon="stats-chart-outline" />
        </View>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
});
