import { TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5856D6',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  text: '#000000',
  textSecondary: '#8E8E93',
  background: '#F2F2F7',
  border: '#C6C6C8',
  transparent: 'transparent',
  successLight: '#E8F5E9',
  errorLight: '#FFEBEE',
  warningLight: '#FFF3E0',
  infoLight: '#E3F2FD',
  darkGray: '#8E8E93',
  error: '#FF3B30',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

type FontWeight = TextStyle['fontWeight'];

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as FontWeight,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as FontWeight,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as FontWeight,
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as FontWeight,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as FontWeight,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as FontWeight,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as FontWeight,
    lineHeight: 16,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
}; 