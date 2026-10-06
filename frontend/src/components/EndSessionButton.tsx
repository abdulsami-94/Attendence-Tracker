import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { sessionService } from '../services/session.service';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface EndSessionButtonProps {
  sessionId: number;
  onEnded: () => void;
}

export function EndSessionButton({ sessionId, onEnded }: EndSessionButtonProps) {
  const [ending, setEnding] = useState(false);

  const endSession = async () => {
    if (ending) return;

    setEnding(true);
    try {
      await sessionService.endSession(sessionId);
      onEnded();
    } catch (error: unknown) {
      let message = 'Something went wrong. Please try again.';
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          message = 'You do not have permission to end this session.';
        } else if (error.response?.status === 404) {
          message = 'This session could not be found. It may have already ended.';
        }
      }
      Alert.alert('Unable to end session', message);
    } finally {
      setEnding(false);
    }
  };

  const confirmEndSession = () => {
    if (ending) return;

    Alert.alert('End session?', 'Students will no longer be able to mark attendance.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End session',
        style: 'destructive',
        onPress: () => {
          void endSession();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.button, ending && styles.disabled]}
      onPress={confirmEndSession}
      disabled={ending}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="End session"
    >
      {ending ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Text style={styles.text}>End Session</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
