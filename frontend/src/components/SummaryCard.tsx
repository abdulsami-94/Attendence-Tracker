import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceSummary } from '../types/dashboard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  summary: AttendanceSummary;
}

export const SummaryCard: React.FC<Props> = ({ summary }) => {
  const getPercentageColor = (percentage: number) => {
    if (percentage > 75) return colors.success;
    if (percentage >= 60) return colors.warning;
    return colors.error;
  };

  const percentageColor = getPercentageColor(summary.overallPercentage);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Attendance Summary</Text>
      
      <View style={styles.percentageContainer}>
        <View style={[styles.percentageCircle, { borderColor: percentageColor }]}>
          <Text style={[styles.percentageText, { color: percentageColor }]}>
            {summary.overallPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.statValue}>{summary.presentLectures}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="close-circle" size={24} color={colors.error} />
          <Text style={styles.statValue}>{summary.absentLectures}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="book" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{summary.totalLectures}</Text>
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
