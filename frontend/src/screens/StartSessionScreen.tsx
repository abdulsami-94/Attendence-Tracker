import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { sessionService } from '../services/session.service';
import { useLocation } from '../hooks/useLocation';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { MainStackParamList } from '../types/navigation';

type StartSessionNavProp = NativeStackNavigationProp<MainStackParamList>;

interface PickerOption {
  subjectId: number;
  sessionType: 'THEORY' | 'LAB';
  label: string;
}

export default function StartSessionScreen() {
  const navigation = useNavigation<StartSessionNavProp>();
  const { getLocation } = useLocation();

  const [options, setOptions] = useState<PickerOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<PickerOption | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const [selectionError, setSelectionError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const data = await sessionService.getSubjects();
        if (!isMounted) return;

        const builtOptions: PickerOption[] = [];
        for (const s of data) {
          if (s.hasTheory) {
            builtOptions.push({
              subjectId: s.id,
              sessionType: 'THEORY',
              label: `${s.name} (Theory)`,
            });
          }
          if (s.hasLab) {
            builtOptions.push({
              subjectId: s.id,
              sessionType: 'LAB',
              label: `${s.name} (Lab)`,
            });
          }
        }

        setOptions(builtOptions);
        if (builtOptions.length === 1) {
          setSelectedOption(builtOptions[0]);
        }
      } catch (err) {
        if (!isMounted) return;
        setGeneralError(getErrorMessage(err));
      } finally {
        if (isMounted) {
          setLoadingSubjects(false);
        }
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartSession = async () => {
    if (loading || loadingSubjects) {
      return;
    }

    if (!selectedOption) {
      setSelectionError('Please select a subject');
      return;
    }

    try {
      setLoading(true);
      setSelectionError('');
      setGeneralError('');

      const coords = await getLocation();
      if (!coords) {
        setGeneralError(
          'Could not get your location. Turn on location services and allow permission.'
        );
        return;
      }

      const session = await sessionService.startSession({
        subjectId: selectedOption.subjectId,
        sessionType: selectedOption.sessionType,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      Alert.alert('Session started', `Code: ${session.currentToken}`, [
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

  const isStartDisabled = loading || loadingSubjects || options.length === 0 || !selectedOption;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Session</Text>
      <Text style={styles.subtitle}>Select the subject and session type for attendance.</Text>

      {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject</Text>

        {loadingSubjects ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading assigned subjects...</Text>
          </View>
        ) : options.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.warning} />
            <Text style={styles.emptyText}>
              No subjects assigned to your account. You cannot start a session.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.pickerButton,
              selectionError ? styles.inputError : null,
              options.length === 1 && styles.pickerButtonSingle,
            ]}
            onPress={() => {
              if (options.length > 1) {
                setPickerModalVisible(true);
              }
            }}
            disabled={options.length <= 1 || loading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !selectedOption && styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {selectedOption ? selectedOption.label : 'Select subject & type'}
            </Text>
            {options.length > 1 && (
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}

        {selectionError ? <Text style={styles.errorText}>{selectionError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, isStartDisabled && styles.buttonDisabled]}
        onPress={handleStartSession}
        disabled={isStartDisabled}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Start Session</Text>
        )}
      </TouchableOpacity>

      {/* Modal for selecting among multiple options */}
      <Modal
        visible={pickerModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => `${item.subjectId}_${item.sessionType}`}
              renderItem={({ item }) => {
                const isSelected =
                  selectedOption?.subjectId === item.subjectId &&
                  selectedOption?.sessionType === item.sessionType;
                return (
                  <TouchableOpacity
                    style={[styles.optionRow, isSelected && styles.selectedOptionRow]}
                    onPress={() => {
                      setSelectedOption(item);
                      setSelectionError('');
                      setPickerModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    marginBottom: spacing.xs,
  },
  pickerButtonSingle: {
    backgroundColor: `${colors.border}40`,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  emptyBox: {
    padding: spacing.md,
    backgroundColor: `${colors.warning}15`,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.sm,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}60`,
  },
  selectedOptionRow: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '700',
    color: colors.primary,
  },
});