export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5856D6',
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F2F2F7',
  gray: '#8E8E93',
  darkGray: '#3C3C43',
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    tertiary: '#C7C7CC',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  border: '#C7C7CC',
};

export const FONTS = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  caption: 12,
};

export const SIZES = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
  radius: 8,
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const SPACING = {
  xs: SIZES.xs,
  small: SIZES.small,
  medium: SIZES.medium,
  large: SIZES.large,
  xl: SIZES.xl,
  xxl: SIZES.xxl,
};

export default {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  SPACING,
}; 