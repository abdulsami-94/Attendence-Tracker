import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { useLocation } from '../hooks/useLocation';
import { attendanceService } from '../services/attendanceService';
import { getOrCreateDeviceId } from '../utils/deviceId';

type Props = NativeStackScreenProps<MainStackParamList, 'MarkAttendance'>;

type ScreenStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function MarkAttendanceScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;

  const { error: gpsError, getLocation } = useLocation();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<ScreenStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleMarkAttendance = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setStatus('error');
      setErrorMessage('Enter the code your teacher gave you.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);
    setGpsLoading(true);

    const coords = await getLocation();
    setGpsLoading(false);

    if (!coords) {
      setStatus('error');
      setErrorMessage(gpsError || 'Could not get your location. Check location permissions and try again.');
      return;
    }

    try {
      const deviceId = await getOrCreateDeviceId();
      await attendanceService.markAttendance({
        token: trimmedCode,
        sessionId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        deviceId,
      });

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      const httpStatus = err.response?.status;
      const backendMessage = err.response?.data?.message;

      switch (httpStatus) {
        case 409:
          setErrorMessage('You have already marked attendance for this session.');
          break;
        case 403:
          setErrorMessage(backendMessage || 'You are outside the classroom geofence.');
          break;
        case 404:
          setErrorMessage('Session not found. Ask your teacher to start a new one.');
          break;
        case 400:
          setErrorMessage(backendMessage || 'This session is not currently active.');
          break;
        default:
          setErrorMessage(backendMessage || 'Something went wrong. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>✓ Attendance marked successfully</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>
        Make sure you're inside the classroom, then enter the code your teacher shows.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Session code"
        value={code}
        onChangeText={(text) => {
          setCode(text);
          if (errorMessage) setErrorMessage(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        editable={status !== 'submitting'}
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[styles.button, status === 'submitting' && styles.buttonDisabled]}
        onPress={handleMarkAttendance}
        disabled={status === 'submitting' || gpsLoading}
      >
        {status === 'submitting' || gpsLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Check In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, minWidth: 160, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  successText: { fontSize: 18, color: '#16a34a', fontWeight: '600', marginBottom: 24 },
  errorText: { color: '#dc2626', marginBottom: 16, textAlign: 'center' },
});