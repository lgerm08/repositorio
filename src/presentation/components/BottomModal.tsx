import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';
import { typography } from '../theme/typography';
import { Button } from './Button';

type BaseProps = {
  visible: boolean;
  onClose: () => void;
};

type ConfirmationProps = BaseProps & {
  type: 'confirmation';
  onConfirm: () => void;
};

type FormProps = BaseProps & {
  type: 'form';
  onSubmit: (value: string) => void;
};

export type BottomModalProps = ConfirmationProps | FormProps;

export function BottomModal(props: BottomModalProps) {
  const { visible, onClose, type } = props;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitting = useRef(false);

  const sheetBg = isDark ? colors.gray900 : colors.background;
  const textColor = isDark ? '#ffffff' : colors.gray950;
  const placeholderColor = isDark ? colors.gray600 : colors.gray300;

  useEffect(() => {
    if (!visible) {
      setValue('');
      submitting.current = false;
      if (blurTimer.current) clearTimeout(blurTimer.current);
    } else if (type === 'form') {
      // Re-focus when modal becomes visible again
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [visible, type]);

  const handleFormBlur = () => {
    if (submitting.current) return;
    blurTimer.current = setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleFormSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    submitting.current = true;
    if (blurTimer.current) clearTimeout(blurTimer.current);
    (props as FormProps).onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>

        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.sheet, { backgroundColor: sheetBg }]}
        >
          {type === 'confirmation' ? (
            <>
              <Text style={[styles.title, { color: textColor }]}>
                Tem certeza que deseja excluir essa tarefa?
              </Text>
              <Text style={[styles.subtitle, { color: colors.gray500 }]}>
                Essa ação não pode ser revertida
              </Text>
              <Button
                label="Excluir tarefa"
                onPress={() => {
                  (props as ConfirmationProps).onConfirm();
                  onClose();
                }}
                backgroundColor={colors.red}
                textColor="#ffffff"
              />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: textColor }]}>
                Qual é a sua tarefa?
              </Text>
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: textColor }]}
                placeholder="Fazer compras"
                placeholderTextColor={placeholderColor}
                value={value}
                onChangeText={setValue}
                autoFocus
                autoCapitalize="sentences"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleFormSubmit}
              />
              <Button
                label="Adicionar tarefa"
                onPress={handleFormSubmit}
                backgroundColor={colors.primary}
                textColor="#ffffff"
                disabled={!value.trim()}
              />
            </>
          )}
        </View>
        </KeyboardAvoidingView>

        {/* Safe-area filler: outside KeyboardAvoidingView so não sobe com o teclado */}
        <View style={{ height: insets.bottom, backgroundColor: sheetBg }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    paddingVertical: 10,
  },
});
