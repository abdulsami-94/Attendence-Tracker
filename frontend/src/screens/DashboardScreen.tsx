import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboard.service';
import { DashboardData } from '../types/dashboard';
import { StudentCard } from '../components/StudentCard';
import { SummaryCard } from '../components/SummaryCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setData(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
      console.error('Dashboard fetch error:', error);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchDashboardData();
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.firstName || data?.student?.fullName || 'Student'}</Text>
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
                onPress={() => console.log('View Attendance')} 
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
                onPress={() => console.log('Profile')} 
              />
              <QuickActionButton 
                title="Logout" 
                icon="log-out-outline" 
                color={colors.error}
                onPress={signOut} 
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
