import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/types';
import { useSession } from '../../hooks/auth/useSession';
import { useAuthContext } from '../../context/AuthContext';
import { useAppTheme } from '../../theme/useAppTheme';
import { typography } from '../../theme/typography';
import { InitialsAvatar } from '../../components/InitialsAvatar';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { user } = useSession();
  const { clearAuth } = useAuthContext();
  const { colors, isDark } = useAppTheme();

  const textColor = isDark ? '#ffffff' : colors.gray950;
  const iconColor = isDark ? '#ffffff' : colors.gray950;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.back}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={24} color={iconColor} />
      </TouchableOpacity>

      <View style={styles.center}>
        <View style={styles.avatarWrapper}>
          <InitialsAvatar name={user?.name} size={192} />
        </View>
        <Text style={[styles.name, { color: textColor }]}>{user?.name ?? ''}</Text>
        <Text style={[styles.email, { color: colors.gray500 }]}>{user?.email ?? ''}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.red }]}
          onPress={clearAuth}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  back: { marginTop: 16, marginLeft: 20 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginBottom: 24,
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    marginBottom: 6,
  },
  email: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  logoutBtn: {
    height: 52,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
});
