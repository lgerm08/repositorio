import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
  Platform,
  Dimensions,
  Animated,
  Easing,
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

function useKeyboardHeight(): number {
  const [height, setHeight] = useState(() => Keyboard.metrics()?.height ?? 0);

  useEffect(() => {
    const t = setTimeout(() => {
      const m = Keyboard.metrics();
      if (m?.height) setHeight(m.height);
    }, 300);

    if (Platform.OS === 'ios') {
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

const SLIDE_DISTANCE = 600;

export function BottomModal(props: BottomModalProps) {
  const { visible, onClose, type } = props;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitting = useRef(false);
  const keyboardHeight = useKeyboardHeight();

  // Internal visibility kept open during slide-out animation
  const [internalVisible, setInternalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SLIDE_DISTANCE)).current;

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      slideAnim.setValue(SLIDE_DISTANCE);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SLIDE_DISTANCE,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setInternalVisible(false));
    }
  }, [visible]);

  const sheetBg = isDark ? colors.gray900 : colors.background;
  const textColor = isDark ? '#ffffff' : colors.gray950;
  const placeholderColor = isDark ? colors.gray600 : colors.gray300;

  useEffect(() => {
    if (!visible) {
      setValue('');
      submitting.current = false;
      if (blurTimer.current) clearTimeout(blurTimer.current);
    } else if (type === 'form') {
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

  // Sheet slides above the keyboard when it appears.
  // paddingBottom covers the home-indicator area with the sheet background color.
  const marginBottom = keyboardHeight > 0 ? keyboardHeight : 0;
  const paddingBottom = insets.bottom + 24;

  return (
    <Modal
      transparent
      visible={internalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: sheetBg, paddingBottom, marginBottom },
            { transform: [{ translateY: slideAnim }] },
          ]}
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
                onBlur={handleFormBlur}
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
        </Animated.View>
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
