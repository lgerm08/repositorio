import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ClipboardWallpaper from '../../../../assets/clipboard-wallpaper.svg';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ClipboardWallpaper
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Organize sua rotina</Text>
        <Text style={styles.subtitle}>
          Gerencie suas tarefas de forma simples, rápida e inteligente.
        </Text>

        <Button
          label="Criar conta"
          onPress={() => navigation.navigate('SignUpName')}
          backgroundColor="#ffffff"
          textColor="#000000"
          style={styles.button}
        />

        <TouchableOpacity onPress={() => navigation.navigate('SignInEmail')} activeOpacity={0.7}>
          <Text style={styles.link}>Já tenho uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 52 : 40,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  button: {
    marginTop: 4,
  },
  link: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: '#ffffff',
  },
});
