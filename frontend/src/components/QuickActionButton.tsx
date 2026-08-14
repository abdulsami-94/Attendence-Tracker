import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const QuickActionButton: React.FC<Props> = ({ title, icon, onPress, color = colors.primary, disabled = false, loading = false }) => {
  return (
    <TouchableOpacity style={[styles.container, disabled && styles.disabled]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Ionicons name={icon} size={28} color={color} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '22%', // allows 4 buttons in a row with spacing
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
