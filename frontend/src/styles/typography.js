import { Platform } from 'react-native';
import * as Colors from './colors';

// Font family definitions
export const FONT_FAMILY = {
  REGULAR: Platform.OS === 'ios' ? 'System' : 'Roboto',
  MEDIUM: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  BOLD: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  LIGHT: Platform.OS === 'ios' ? 'System' : 'Roboto-Light',
};

// Font weight definitions
export const FONT_WEIGHT = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

// Line height multiplier (based on font size)
export const LINE_HEIGHT_MULTIPLIER = 1.5;

// Font size definitions
export const FONT_SIZE = {
  TINY: 10,
  XSMALL: 12,
  SMALL: 14,
  MEDIUM: 16,
  LARGE: 18,
  XLARGE: 20,
  XXLARGE: 24,
  XXXLARGE: 30,
  HUGE: 36,
};

// Typography styles
export const TYPOGRAPHY = {
  // Headers
  H1: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.HUGE,
    lineHeight: FONT_SIZE.HUGE * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: -0.5,
  },
  H2: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.XXXLARGE,
    lineHeight: FONT_SIZE.XXXLARGE * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: -0.4,
  },
  H3: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.XXLARGE,
    lineHeight: FONT_SIZE.XXLARGE * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: -0.3,
  },
  H4: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.XLARGE,
    lineHeight: FONT_SIZE.XLARGE * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: -0.2,
  },
  
  // Body text
  BODY_LARGE: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: FONT_SIZE.LARGE,
    lineHeight: FONT_SIZE.LARGE * LINE_HEIGHT_MULTIPLIER,
  },
  BODY: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: FONT_SIZE.MEDIUM,
    lineHeight: FONT_SIZE.MEDIUM * LINE_HEIGHT_MULTIPLIER,
  },
  BODY_SMALL: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: FONT_SIZE.SMALL,
    lineHeight: FONT_SIZE.SMALL * LINE_HEIGHT_MULTIPLIER,
  },
  BODY_XSMALL: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: FONT_SIZE.XSMALL,
    lineHeight: FONT_SIZE.XSMALL * LINE_HEIGHT_MULTIPLIER,
  },
  
  // Special styles
  CAPTION: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: FONT_SIZE.XSMALL,
    lineHeight: FONT_SIZE.XSMALL * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: 0.4,
  },
  BUTTON: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    fontSize: FONT_SIZE.MEDIUM,
    lineHeight: FONT_SIZE.MEDIUM * 1.3, // Buttons have slightly tighter line height
    letterSpacing: 0.2,
  },
  BUTTON_SMALL: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    fontSize: FONT_SIZE.SMALL,
    lineHeight: FONT_SIZE.SMALL * 1.3,
    letterSpacing: 0.1,
  },
  LABEL: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    fontSize: FONT_SIZE.SMALL,
    lineHeight: FONT_SIZE.SMALL * LINE_HEIGHT_MULTIPLIER,
    letterSpacing: 0.2,
  },
};

// Letter spacing
export const LETTER_SPACING_TIGHT = -0.5;
export const LETTER_SPACING_NORMAL = 0;
export const LETTER_SPACING_LOOSE = 1;

// Predefined styles for common text elements

// Headings
export const H1 = {
  fontFamily: FONT_FAMILY.BOLD,
  fontWeight: FONT_WEIGHT.BOLD,
  fontSize: FONT_SIZE.HUGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.HUGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_TIGHT,
};

export const H2 = {
  fontFamily: FONT_FAMILY.BOLD,
  fontWeight: FONT_WEIGHT.BOLD,
  fontSize: FONT_SIZE.XXXLARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.XXXLARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_TIGHT,
};

export const H3 = {
  fontFamily: FONT_FAMILY.BOLD,
  fontWeight: FONT_WEIGHT.BOLD,
  fontSize: FONT_SIZE.XXLARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.XXLARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_TIGHT,
};

export const H4 = {
  fontFamily: FONT_FAMILY.BOLD,
  fontWeight: FONT_WEIGHT.BOLD,
  fontSize: FONT_SIZE.XLARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.XLARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_TIGHT,
};

export const H5 = {
  fontFamily: FONT_FAMILY.MEDIUM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontSize: FONT_SIZE.LARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.LARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

// Body text
export const BODY_LARGE = {
  fontFamily: FONT_FAMILY.REGULAR,
  fontWeight: FONT_WEIGHT.REGULAR,
  fontSize: FONT_SIZE.LARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.LARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

export const BODY = {
  fontFamily: FONT_FAMILY.REGULAR,
  fontWeight: FONT_WEIGHT.REGULAR,
  fontSize: FONT_SIZE.MEDIUM,
  color: Colors.TEXT_SECONDARY,
  lineHeight: FONT_SIZE.MEDIUM * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

export const BODY_SMALL = {
  fontFamily: FONT_FAMILY.REGULAR,
  fontWeight: FONT_WEIGHT.REGULAR,
  fontSize: FONT_SIZE.SMALL,
  color: Colors.TEXT_SECONDARY,
  lineHeight: FONT_SIZE.SMALL * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

// Labels and buttons
export const LABEL = {
  fontFamily: FONT_FAMILY.MEDIUM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontSize: FONT_SIZE.SMALL,
  color: Colors.TEXT_SECONDARY,
  lineHeight: FONT_SIZE.SMALL * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

export const BUTTON_TEXT = {
  fontFamily: FONT_FAMILY.MEDIUM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontSize: FONT_SIZE.MEDIUM,
  color: Colors.WHITE,
  lineHeight: FONT_SIZE.MEDIUM * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
  textTransform: 'uppercase',
};

export const BUTTON_TEXT_SMALL = {
  fontFamily: FONT_FAMILY.MEDIUM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontSize: FONT_SIZE.SMALL,
  color: Colors.WHITE,
  lineHeight: FONT_SIZE.SMALL * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
  textTransform: 'uppercase',
};

// Navigation
export const TAB_LABEL = {
  fontFamily: FONT_FAMILY.MEDIUM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontSize: FONT_SIZE.TINY,
  color: Colors.TEXT_SECONDARY,
  lineHeight: FONT_SIZE.TINY * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
};

export const HEADER_TITLE = {
  fontFamily: FONT_FAMILY.BOLD,
  fontWeight: FONT_WEIGHT.BOLD,
  fontSize: FONT_SIZE.LARGE,
  color: Colors.TEXT_PRIMARY,
  lineHeight: FONT_SIZE.LARGE * LINE_HEIGHT_MULTIPLIER,
  letterSpacing: LETTER_SPACING_NORMAL,
}; 