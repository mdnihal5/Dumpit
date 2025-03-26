import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View
} from 'react-native';
import { COLORS, SIZES, TYPOGRAPHY } from '../theme';

/**
 * Custom Button component
 * 
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {function} props.onPress - Function to call when button is pressed
 * @param {string} props.variant - Button style variant ('filled', 'outline', 'text')
 * @param {string} props.size - Button size variant ('small', 'medium', 'large')
 * @param {Object} props.style - Additional style for the button
 * @param {Object} props.textStyle - Additional style for the button text
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether to show loading indicator
 * @param {ReactNode} props.icon - Icon to display on the button
 * @param {string} props.iconPosition - Icon position ('left', 'right')
 */
const Button = ({ 
  title, 
  onPress, 
  variant = 'filled', // filled, outline, text
  size = 'medium', // small, medium, large
  style, 
  textStyle,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left' // left, right
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Add variant styles
    if (variant === 'filled') {
      buttonStyle.push(styles.filledButton);
    } else if (variant === 'outline') {
      buttonStyle.push(styles.outlineButton);
    } else if (variant === 'text') {
      buttonStyle.push(styles.textButton);
    }
    
    // Add size styles
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Add disabled style
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Add custom style
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray = [styles.buttonText];
    
    // Add variant text styles
    if (variant === 'filled') {
      textStyleArray.push(styles.filledButtonText);
    } else if (variant === 'outline') {
      textStyleArray.push(styles.outlineButtonText);
    } else if (variant === 'text') {
      textStyleArray.push(styles.textButtonText);
    }
    
    // Add size text styles
    if (size === 'small') {
      textStyleArray.push(styles.smallButtonText);
    } else if (size === 'large') {
      textStyleArray.push(styles.largeButtonText);
    }
    
    // Add disabled text style
    if (disabled) {
      textStyleArray.push(styles.disabledButtonText);
    }
    
    // Add custom text style
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
    
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'filled' ? COLORS.white : COLORS.primary} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          
          <Text style={getTextStyle()}>{title}</Text>
          
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  filledButton: {
    backgroundColor: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: COLORS.textTertiary,
    borderColor: COLORS.textTertiary,
  },
  buttonText: {
    fontWeight: '600',
  },
  filledButtonText: {
    color: COLORS.white,
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  textButtonText: {
    color: COLORS.primary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: COLORS.white,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  }
});

export default Button; 