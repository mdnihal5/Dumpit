import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from './theme';

/**
 * Common styles shared across components
 */
const commonStyles = StyleSheet.create({
  // Safe area container
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Container with padding
  container: {
    flex: 1,
    padding: spacing.md,
  },
  
  // Scrollable content
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  
  // Card style
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Row with space between
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Centered content
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  
  // Loading container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Loading text
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.body2.fontSize,
  },
  
  // Empty state container
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  
  // Empty state title
  emptyTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as any,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  
  // Empty state text
  emptyText: {
    fontSize: typography.body1.fontSize,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Button style
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  
  // Button text style
  buttonText: {
    color: colors.white,
    fontSize: typography.body1.fontSize,
    fontWeight: '600' as any,
  },
});

export default commonStyles; 