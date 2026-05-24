export const grays = {
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a1a1a1',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  gray950: '#0a0a0a',
};

export const lightColors = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  primary: '#822DE6',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  red: '#FB2C36',
  ...grays,
};

export const darkColors = {
  background: '#0a0a0a',
  surface: '#1F2937',
  primary: '#822DE6',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  red: '#FB2C36',
  ...grays,
};

export type AppColors = typeof lightColors;
