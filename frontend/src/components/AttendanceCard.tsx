import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '../types/attendance';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  record: AttendanceRecord;
}

/**
 * Formats an ISO timestamp string into a readable date (e.g. "09 Aug 2026").
 */
const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats an ISO timestamp string into a readable time (e.g. "10:30 AM").
 */
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const AttendanceCard: React.FC<Props> = ({ record }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={28} color={colors.success} />
      </View>
      <View style={styles.content}>
        <Text style={styles.subject}>{record.subject}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(record.timestamp)}</Text>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={styles.timeIcon} />
          <Text style={styles.metaText}>{formatTime(record.timestamp)}</Text>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Present</Text>
      </View>
    </View>
  );
};

export default AttendanceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timeIcon: {
    marginLeft: spacing.sm,
  },
  statusBadge: {
    backgroundColor: `${colors.success}18`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
});