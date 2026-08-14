import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'An error occurred. Please try again.', 
  onRetry,
  retrying = false,
  fullScreen = true
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          style={[styles.retryButton, retrying && styles.retryButtonDisabled]}
          onPress={onRetry}
          disabled={retrying}
          activeOpacity={0.7}
        >
          {retrying ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="refresh" size={18} color={colors.white} />
          )}
          <Text style={styles.retryButtonText}>{retrying ? 'Retrying...' : 'Retry'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
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
  retryButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
