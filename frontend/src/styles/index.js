import * as Colors from './colors';
import * as Typography from './typography';

// Spacing for consistent padding and margins
export const SPACING = {
  TINY: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
  HUGE: 64,
};

// Border radius values
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
  ROUND: 1000, // For circular elements
};

// Shadow styles (iOS and Android)
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
};

// Common layout styles
export const LAYOUT = {
  FLEX: {
    flex: 1,
  },
  ROW: {
    flexDirection: 'row',
  },
  COLUMN: {
    flexDirection: 'column',
  },
  CENTER: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  JUSTIFY_CENTER: {
    justifyContent: 'center',
  },
  ALIGN_CENTER: {
    alignItems: 'center',
  },
  JUSTIFY_BETWEEN: {
    justifyContent: 'space-between',
  },
  JUSTIFY_AROUND: {
    justifyContent: 'space-around',
  },
  JUSTIFY_END: {
    justifyContent: 'flex-end',
  },
  ALIGN_END: {
    alignItems: 'flex-end',
  },
  SELF_CENTER: {
    alignSelf: 'center',
  },
  SELF_END: {
    alignSelf: 'flex-end',
  },
};

// Common containers
export const CONTAINERS = {
  SCREEN: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  SCREEN_WITH_PADDING: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    padding: SPACING.MEDIUM,
  },
  CARD: {
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    ...SHADOWS.SMALL,
  },
};

export { Colors, Typography }; 