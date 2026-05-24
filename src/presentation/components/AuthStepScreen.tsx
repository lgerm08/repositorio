import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
}: AuthStepScreenProps) {
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const titleColor = isDark ? '#ffffff' : colors.gray950;
  const iconColor = isDark ? '#ffffff' : colors.gray950;
  const placeholderColor = isDark ? colors.gray600 : colors.gray300;

  const buttonBg = buttonPrimary ? colors.primary : isDark ? '#ffffff' : colors.gray950;
  const buttonTextColor = buttonPrimary ? '#ffffff' : isDark ? colors.gray950 : '#ffffff';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <LoadingOverlay visible={loading} />
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    keyboard: { flex: 1, paddingHorizontal: 24, paddingBottom: 16 },
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
