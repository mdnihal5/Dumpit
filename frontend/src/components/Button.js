import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Colors, 
  Typography, 
  BorderRadius, 
  Spacing, 
  Shadows 
} from '../styles';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  style = {},
  textStyle = {},
  ...props
}) => {
  // Determine button styles based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  // Determine button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  // Determine disabled style
  const getDisabledStyle = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return styles.disabledOutlineButton;
    }
    return styles.disabledButton;
  };

  // Main container style
  const containerStyle = [
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    fullWidth && styles.fullWidth,
    disabled && getDisabledStyle(),
    style
  ];

  // Text style
  const buttonTextStyle = [
    getTextStyle(),
    getTextSizeStyle(),
    disabled && styles.disabledText,
    textStyle
  ];

  // Render loading indicator or button content
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? Colors.PRIMARY : Colors.TEXT.INVERSE} 
          size="small" 
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <Text style={buttonTextStyle}>{title}</Text>
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
  },
  secondaryButton: {
    backgroundColor: Colors.SECONDARY,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: Colors.DANGER,
  },
  successButton: {
    backgroundColor: Colors.SECONDARY,
  },
  // Sizes
  smallButton: {
    paddingVertical: Spacing.XSMALL,
    paddingHorizontal: Spacing.MEDIUM,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.LARGE,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: Spacing.MEDIUM,
    paddingHorizontal: Spacing.XLARGE,
    minHeight: 52,
  },
  // Text styles
  buttonText: {
    color: Colors.TEXT.INVERSE,
    textAlign: 'center',
    ...Typography.TYPOGRAPHY.BUTTON,
  },
  outlineText: {
    color: Colors.PRIMARY,
    textAlign: 'center',
    ...Typography.TYPOGRAPHY.BUTTON,
  },
  // Text sizes
  smallText: {
    ...Typography.TYPOGRAPHY.BUTTON_SMALL,
  },
  mediumText: {
    ...Typography.TYPOGRAPHY.BUTTON,
  },
  largeText: {
    fontSize: Typography.FONT_SIZE.LARGE,
  },
  // States
  disabledButton: {
    backgroundColor: Colors.BACKGROUND.DISABLED,
  },
  disabledOutlineButton: {
    borderColor: Colors.BORDER.LIGHT,
  },
  disabledText: {
    color: Colors.TEXT.DISABLED,
  },
  fullWidth: {
    width: '100%',
  },
  // Icon positioning
  iconLeft: {
    marginRight: Spacing.XSMALL,
  },
  iconRight: {
    marginLeft: Spacing.XSMALL,
  },
});

export default Button; 