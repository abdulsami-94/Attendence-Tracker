import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sessionService } from '../services/session.service';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function StartSessionScreen() {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (loading) {
      return;
    }

    const trimmedSubject = subject.trim();

    if (!trimmedSubject) {
      setSubjectError('Subject is required');
      return;
    }

    try {
      setLoading(true);
      setSubjectError('');
      setGeneralError('');

      await sessionService.startSession({ subject: trimmedSubject });

      Alert.alert('Session started', 'Your attendance session has started.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setGeneralError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Session</Text>
      <Text style={styles.subtitle}>Enter the subject name for this attendance session.</Text>

      {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject</Text>

        <TextInput
          style={[
            styles.input,
            subjectError ? styles.inputError : null,
          ]}
          placeholder="Enter subject"
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={(text) => {
            setSubject(text);
            if (subjectError) setSubjectError('');
            if (generalError) setGeneralError('');
          }}
          editable={!loading}
        />

        {subjectError ? <Text style={styles.errorText}>{subjectError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleStartSession}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Start Session</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  generalError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});