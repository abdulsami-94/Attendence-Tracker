import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { MainStackParamList } from '../types/navigation';
import { QuickActionButton } from '../components/QuickActionButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type TeacherDashboardNavProp = NativeStackNavigationProp<MainStackParamList>;

export default function TeacherDashboardScreen() {
  const navigation = useNavigation<TeacherDashboardNavProp>();
  const { user, signOut, loading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school-outline" size={42} color={colors.primary} />
        </View>

        <Text style={styles.title}>Teacher Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back, {user?.name || 'Teacher'}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <QuickActionButton
          title="Start Session"
          icon="add-circle-outline"
          onPress={() => navigation.navigate('StartSession')}
        />

        <QuickActionButton
          title="My Sessions"
          icon="list-outline"
          color={colors.secondary}
          onPress={() => navigation.navigate('TeacherSessions')}
        />

        <QuickActionButton
          title="Profile"
          icon="person-outline"
          color={colors.warning}
          onPress={() => navigation.navigate('Profile')}
        />

        <QuickActionButton
          title={loading ? 'Logging out' : 'Logout'}
          icon="log-out-outline"
          color={colors.error}
          onPress={signOut}
          disabled={loading}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
});