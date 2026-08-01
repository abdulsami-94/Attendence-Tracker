import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StudentInfo } from '../types/dashboard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  student: StudentInfo;
}

export const StudentCard: React.FC<Props> = ({ student }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {student.profileImageUrl ? (
          <Image source={{ uri: student.profileImageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={32} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.rollNumber}>Roll No: {student.rollNumber}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Department:</Text>
          <Text style={styles.detailValue}>{student.department}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Semester:</Text>
          <Text style={styles.detailValue}>{student.semester}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Division:</Text>
          <Text style={styles.detailValue}>{student.division}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  rollNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  details: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
