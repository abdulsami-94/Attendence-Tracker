import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AttendanceSummaryResponse } from '../types/attendance';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  summary: AttendanceSummaryResponse | null;
  loading?: boolean;
  error?: boolean;
}

export const SummaryCard: React.FC<Props> = ({ summary, loading = false, error = false }) => {
  const getPercentageColor = (percentage: number) => {
    if (percentage > 75) return colors.success;
    if (percentage >= 60) return colors.warning;
    return colors.error;
  };

  const hasData = summary !== null && !error && !loading;
  const percentageColor = hasData ? getPercentageColor(summary.percentage) : colors.border;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Attendance Summary</Text>
      
      <View style={styles.percentageContainer}>
        <View style={[styles.percentageCircle, { borderColor: percentageColor }]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : error || !summary ? (
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>—</Text>
          ) : (
            <Text style={[styles.percentageText, { color: percentageColor }]}>
              {summary.percentage}%
            </Text>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color={hasData ? colors.success : colors.textSecondary} />
          <Text style={styles.statValue}>
            {loading ? '...' : error || !summary ? '—' : summary.attendedSessions}
          </Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="close-circle" size={24} color={hasData ? colors.error : colors.textSecondary} />
          <Text style={styles.statValue}>
            {loading ? '...' : error || !summary ? '—' : Math.max(0, summary.totalSessions - summary.attendedSessions)}
          </Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="book" size={24} color={hasData ? colors.primary : colors.textSecondary} />
          <Text style={styles.statValue}>
            {loading ? '...' : error || !summary ? '—' : summary.totalSessions}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
