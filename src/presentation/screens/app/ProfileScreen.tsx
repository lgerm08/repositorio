import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSession } from '../../hooks/auth/useSession';
import { useAuthContext } from '../../context/AuthContext';
import { useAppTheme } from '../../theme/useAppTheme';
import { AppColors } from '../../theme/colors';

export function ProfileScreen() {
  const { user } = useSession();
  const { clearAuth } = useAuthContext();
  const { colors, typography } = useAppTheme();

  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') ?? '?';

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? '—'}</Text>
        <Text style={styles.email}>{user?.email ?? '—'}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome</Text>
          <Text style={styles.infoValue}>{user?.name ?? '—'}</Text>
        </View>
        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={clearAuth}>
        <Text style={styles.logoutText}>Fazer logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: AppColors, typography: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 16,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: typography.size.xxl,
      fontWeight: typography.weight.bold,
      color: '#fff',
    },
    name: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 32,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoRowLast: { borderBottomWidth: 0 },
    infoLabel: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      fontWeight: typography.weight.medium,
    },
    infoValue: {
      fontSize: typography.size.sm,
      color: colors.text,
      maxWidth: '60%',
      textAlign: 'right',
    },
    logoutBtn: {
      height: 48,
      backgroundColor: colors.error,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutText: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.semiBold,
      color: '#fff',
    },
  });
}
