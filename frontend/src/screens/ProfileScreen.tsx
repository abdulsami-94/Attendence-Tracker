import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/Avatar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, isInitializing, signOut, loading } = useAuth();

  if (isInitializing) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!user) {
    return <ErrorState message="Unable to load user profile." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Avatar name={user.name} size={100} />
        <Text style={styles.headerName}>{user.name}</Text>
        <Text style={styles.headerRole}>STUDENT</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={24} color={colors.textSecondary} style={styles.icon} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={24} color={colors.textSecondary} style={styles.icon} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Ionicons name="id-card-outline" size={24} color={colors.textSecondary} style={styles.icon} />
          <View style={styles.rowContent}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.value}>{user.id}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={signOut}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.error} />
        ) : (
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
        )}
        <Text style={styles.logoutText}>{loading ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  headerRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  rowContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.error}15`,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
