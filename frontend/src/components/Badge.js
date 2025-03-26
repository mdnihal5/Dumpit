import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../styles';

const Badge = ({
  label,
  type = 'default',
  size = 'medium',
  color,
  backgroundColor,
  style,
  textStyle,
}) => {
  // Get styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: Colors.SUCCESS.LIGHT,
          textColor: Colors.SUCCESS.DEFAULT
        };
      case 'error':
        return {
          backgroundColor: Colors.ERROR.LIGHT,
          textColor: Colors.ERROR.DEFAULT
        };
      case 'warning':
        return {
          backgroundColor: Colors.WARNING.LIGHT,
          textColor: Colors.WARNING.DEFAULT
        };
      case 'info':
        return {
          backgroundColor: Colors.INFO.LIGHT,
          textColor: Colors.INFO.DEFAULT
        };
      case 'primary':
        return {
          backgroundColor: Colors.PRIMARY_LIGHT,
          textColor: Colors.PRIMARY
        };
      default:
        return {
          backgroundColor: Colors.GRAY.LIGHT,
          textColor: Colors.TEXT.SECONDARY
        };
    }
  };

  // Get styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          text: styles.textSmall
        };
      case 'large':
        return {
          container: styles.containerLarge,
          text: styles.textLarge
        };
      default: // medium
        return {
          container: styles.containerMedium,
          text: styles.textMedium
        };
    }
  };

  const typeStyles = getTypeStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View 
      style={[
        styles.container,
        sizeStyles.container,
        { backgroundColor: backgroundColor || typeStyles.backgroundColor },
        style
      ]}
    >
      <Text 
        style={[
          styles.text,
          sizeStyles.text,
          { color: color || typeStyles.textColor },
          textStyle
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.LARGE,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.SMALL,
  },
  containerSmall: {
    paddingVertical: SPACING.TINY / 2,
    minWidth: 20,
  },
  containerMedium: {
    paddingVertical: SPACING.TINY,
    minWidth: 24,
  },
  containerLarge: {
    paddingVertical: SPACING.SMALL,
    minWidth: 30,
  },
  text: {
    textAlign: 'center',
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  textSmall: {
    ...Typography.TYPOGRAPHY.CAPTION,
  },
  textMedium: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
  },
  textLarge: {
    ...Typography.TYPOGRAPHY.BODY,
  },
});

export default Badge; 