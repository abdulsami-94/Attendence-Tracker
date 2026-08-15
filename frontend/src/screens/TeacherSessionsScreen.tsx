import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { sessionService, Session } from '../services/session.service';
import { MainStackParamList } from '../types/navigation';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { getErrorMessage } from '../utils/errorUtils';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type TeacherSessionsNavProp = NativeStackNavigationProp<MainStackParamList>;

export default function TeacherSessionsScreen() {
  const navigation = useNavigation<TeacherSessionsNavProp>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchSessions = useCallback(async () => {
    try {
      setError('');
      const data = await sessionService.getMySessions();
      setSessions(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    await fetchSessions();
    setLoading(false);
  }, [fetchSessions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  }, [fetchSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  if (loading) {
    return <LoadingState message="Loading sessions..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadSessions} />;
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        <EmptyState
          message="No sessions found. Start a session to begin taking attendance."
          icon="calendar-outline"
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.sessionCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('SessionAttendance', {
              sessionId: item.id,
            })
          }
        >
          <View style={styles.iconContainer}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
          </View>

          <View style={styles.sessionInfo}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.date}>
              {new Date(item.startTime).toLocaleString()}
            </Text>

            <Text
              style={[
                styles.status,
                item.active ? styles.activeStatus : styles.endedStatus,
              ]}
            >
              {item.active ? 'Active' : 'Ended'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeStatus: {
    color: colors.success,
  },
  endedStatus: {
    color: colors.textSecondary,
  },
});