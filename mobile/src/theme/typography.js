export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  heading: 32,

  // Spacing and layout
  padding: 16,
  margin: 16,
  radius: 8,
  borderWidth: 1,
};

export const TYPOGRAPHY = {
  heading: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.heading,
    lineHeight: SIZES.heading * 1.3,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.title,
    lineHeight: SIZES.title * 1.3,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xxl,
    lineHeight: SIZES.xxl * 1.3,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.large,
    lineHeight: SIZES.large * 1.5,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    lineHeight: SIZES.medium * 1.5,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    lineHeight: SIZES.small * 1.5,
  },
  button: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.large,
    lineHeight: SIZES.large * 1.2,
    textTransform: 'uppercase',
  },
};

export default { FONTS, SIZES, TYPOGRAPHY }; 