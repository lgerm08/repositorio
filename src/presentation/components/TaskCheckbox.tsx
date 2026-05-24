import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';

interface TaskCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

const SIZE = 22;

export function TaskCheckbox({ checked, onPress }: TaskCheckboxProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.box,
        checked
          ? { backgroundColor: colors.primary, borderWidth: 0 }
          : { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: isDark ? colors.gray700 : colors.gray300 },
      ]}
    >
      {checked && <Ionicons name="checkmark" size={14} color="#ffffff" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: SIZE,
    height: SIZE,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
