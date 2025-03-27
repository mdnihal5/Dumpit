import { DefaultTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color scheme inspired by construction materials theme
export const colors = {
  primary: '#FF5722', // Construction orange
  secondary: '#455A64', // Industrial blue-gray
  tertiary: '#FFC107', // Warning yellow
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#263238', // Dark text for good readability
  border: '#E0E0E0',
  notification: '#F44336',
  error: '#D32F2F',
  success: '#4CAF50',
  warning: '#FFA000',
  info: '#2196F3',
  lightGray: '#F5F5F5',
  mediumGray: '#9E9E9E',
  darkGray: '#616161',
  black: '#212121',
  white: '#FFFFFF',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cement: '#CCCCCC',
  brick: '#A5432A',
  steel: '#71797E',
  wood: '#855E42',
};

// Typography scales
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
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 38,
    xxxl: 46,
  },
  // Text styles for consistent typography
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 46,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 38,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radii
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Dimensions
export const dimensions = {
  fullWidth: width,
  fullHeight: height,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
};

// Create the Paper theme
export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.card,
    text: colors.text,
    error: colors.error,
    disabled: colors.darkGray,
    placeholder: colors.darkGray,
    backdrop: colors.overlay,
    notification: colors.notification,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: typography.fontWeights.regular as any,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: typography.fontWeights.medium as any,
    },
    light: {
      fontFamily: 'System',
      fontWeight: typography.fontWeights.light as any,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: typography.fontWeights.light as any,
    },
  },
  roundness: borderRadius.md,
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  input: {
    height: 50,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSizes.md,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  textButton: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium as any,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  paperTheme,
  commonStyles,
}; 