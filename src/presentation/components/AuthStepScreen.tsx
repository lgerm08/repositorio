import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Dimensions,
  TextInputProps,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { LoadingOverlay } from './LoadingOverlay';
import { useAppTheme } from '../theme/useAppTheme';
import { typography } from '../theme/typography';
import { AppColors } from '../theme/colors';

export interface AuthStepScreenProps
  extends Pick<TextInputProps, 'keyboardType' | 'secureTextEntry' | 'autoCapitalize' | 'autoCorrect'> {
  title: string;
  placeholder: string;
  value: string;
  onChangeValue: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  /** Label for the action button. Defaults to "Continuar". */
  buttonLabel?: string;
  /** When true, the button uses primary color + white text in both modes. */
  buttonPrimary?: boolean;
  /** Error message shown below the input. */
  error?: string;
  /** Shows a loading spinner on the button and prevents interaction. */
  loading?: boolean;
  /** Extra pixels between the top of the keyboard and the button. Defaults to 56. */
  keyboardPaddingOffset?: number;
}

function useKeyboardHeight(): number {
  const [height, setHeight] = useState(() => Keyboard.metrics()?.height ?? 0);

  useEffect(() => {
    // Delayed fallback: catches cases where keyboard is mid-transition on mount
    // (e.g. email → password causes a keyboard-type change that makes metrics() stale)
    const t = setTimeout(() => {
      const m = Keyboard.metrics();
      if (m?.height) setHeight(m.height);
    }, 300);

    if (Platform.OS === 'ios') {
      // Single event that covers appear, disappear, AND type-change transitions —
      // avoids the hide→show gap that occurs when switching to secureTextEntry
      const sub = Keyboard.addListener('keyboardWillChangeFrame', (e) => {
        const screenH = Dimensions.get('screen').height;
        setHeight(e.endCoordinates.screenY >= screenH ? 0 : e.endCoordinates.height);
      });
      return () => { sub.remove(); clearTimeout(t); };
    } else {
      const show = Keyboard.addListener('keyboardDidShow', (e) => setHeight(e.endCoordinates.height));
      const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
      return () => { show.remove(); hide.remove(); clearTimeout(t); };
    }
  }, []);

  return height;
}

export function AuthStepScreen({
  title,
  placeholder,
  value,
  onChangeValue,
  onBack,
  onContinue,
  continueDisabled,
  keyboardType,
  secureTextEntry,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  buttonLabel = 'Continuar',
  buttonPrimary = false,
  error,
  loading = false,
  keyboardPaddingOffset = 56,
}: AuthStepScreenProps) {
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const titleColor = isDark ? '#ffffff' : colors.gray950;
  const iconColor = isDark ? '#ffffff' : colors.gray950;
  const placeholderColor = isDark ? colors.gray600 : colors.gray300;

  const buttonBg = buttonPrimary ? colors.primary : isDark ? '#ffffff' : colors.gray950;
  const buttonTextColor = buttonPrimary ? '#ffffff' : isDark ? colors.gray950 : '#ffffff';

  // When keyboard is visible its height already includes the bottom safe area on iOS,
  // so we skip the SafeAreaView bottom edge and manage it manually here.
  const paddingBottom = keyboardHeight > 0
    ? keyboardHeight + keyboardPaddingOffset
    : insets.bottom + keyboardPaddingOffset;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <LoadingOverlay visible={loading} />
      <View style={[styles.container, { paddingBottom }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={iconColor} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeValue}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.spacer} />

        <Button
          label={buttonLabel}
          onPress={onContinue}
          backgroundColor={buttonBg}
          textColor={buttonTextColor}
          disabled={continueDisabled ?? !value.trim()}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 24 },
    back: { marginTop: 16 },
    title: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 20,
      marginTop: 32,
    },
    input: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      marginTop: 32,
      paddingVertical: 8,
    },
    error: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      color: colors.error,
      marginTop: 8,
    },
    spacer: { flex: 1 },
  });
}
