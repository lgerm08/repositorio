import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { typography } from '../theme/typography';

interface InitialsAvatarProps {
  name?: string;
  size: number;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

export function InitialsAvatar({ name, size }: InitialsAvatarProps) {
  const { colors, isDark } = useAppTheme();

  const bg = isDark ? colors.gray800 : colors.gray200;
  const textColor = isDark ? colors.gray400 : colors.gray500;
  const fontSize = Math.round(size * 0.33);

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: typography.fontFamily.semiBold,
  },
});
