import { useColorScheme } from 'react-native';
import { lightColors, darkColors, AppColors } from './colors';
import { typography } from './typography';

export function useAppTheme(): { colors: AppColors; typography: typeof typography; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    typography,
    isDark,
  };
}
