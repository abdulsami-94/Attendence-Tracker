import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  subjectName: string;
  present: number;
  total: number;
}

export const AttendanceCard: React.FC<Props> = ({ subjectName, present, total }) => {
  const percentage = total > 0 ? (present / total) * 100 : 0;
  
  const getPercentageColor = (percent: number) => {
    if (percent > 75) return colors.success;
    if (percent >= 60) return colors.warning;
    return colors.error;
  };

  const percentageColor = getPercentageColor(percentage);

  return (
    <View style={styles.card}>
      <Text style={styles.subjectText}>{subjectName}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.ratioText}>{present} / {total}</Text>
        <Text style={[styles.percentageText, { color: percentageColor }]}>
          {percentage.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratioText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
