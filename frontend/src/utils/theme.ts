import { DefaultTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color scheme inspired by modern UIs like Stripe and Vercel
export const colors = {
  // Primary colors
  primary: '#4F46E5', // Indigo - modern primary color
  primaryLight: '#818CF8', // Light indigo
  primaryDark: '#3730A3', // Dark indigo
  
  // Secondary colors
  secondary: '#10B981', // Emerald - secondary action color
  secondaryLight: '#34D399', // Light emerald
  secondaryDark: '#059669', // Dark emerald
  
  // Accent colors
  accent: '#F59E0B', // Amber - attention color
  accentLight: '#FBBF24', // Light amber
  accentDark: '#D97706', // Dark amber
  
  // UI backgrounds
  background: '#F8FAFC', // Light blue-gray background
  card: '#FFFFFF', // White card background
  cardHover: '#F1F5F9', // Light hover state
  
  // Text colors
  text: '#1E293B', // Slate-800
  textSecondary: '#64748B', // Slate-500
  textTertiary: '#94A3B8', // Slate-400
  textInverted: '#FFFFFF', // White text
  
  // Status colors
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Success states with alpha
  successLight: 'rgba(16, 185, 129, 0.1)', // Emerald with alpha
  warningLight: 'rgba(245, 158, 11, 0.1)', // Amber with alpha
  errorLight: 'rgba(239, 68, 68, 0.1)', // Red with alpha
  infoLight: 'rgba(59, 130, 246, 0.1)', // Blue with alpha
  
  // Grayscale
  black: '#0F172A', // Slate-900
  darkGray: '#334155', // Slate-700
  mediumGray: '#94A3B8', // Slate-400
  lightGray: '#E2E8F0', // Slate-200
  white: '#FFFFFF', // White
  
  // Overlay/transparent colors
  overlay: 'rgba(15, 23, 42, 0.7)', // Slate-900 with alpha
  transparent: 'transparent',
  
  // Additional colors from the construction theme (for backward compatibility)
  notification: '#F43F5E', // Rose-500
  border: '#E2E8F0', // Slate-200
  cement: '#CBD5E1', // Slate-300
  brick: '#B91C1C', // Red-700
  steel: '#475569', // Slate-600
  wood: '#92400E', // Amber-800
  tertiary: '#F59E0B', // Amber-500 (kept for compatibility)
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
  xs: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
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
    disabled: colors.mediumGray,
    placeholder: colors.mediumGray,
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
  safeArea: {
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
  cardHover: {
    backgroundColor: colors.cardHover,
  },
  section: {
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  input: {
    height: 50,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSizes.md,
    backgroundColor: colors.white,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium as any,
  },
  textButton: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium as any,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
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