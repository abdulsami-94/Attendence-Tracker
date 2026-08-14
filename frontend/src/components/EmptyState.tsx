import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface EmptyStateProps {
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No data available.', 
  icon = 'folder-open-outline' 
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.disabled} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
