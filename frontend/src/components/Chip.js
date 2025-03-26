import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../styles';

const Chip = ({
  label,
  selected = false,
  onPress,
  onRemove,
  icon,
  type = 'default',
  size = 'medium',
  disabled = false,
  style,
}) => {
  // Get style based on type
  const getTypeStyle = () => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: selected ? Colors.PRIMARY : `${Colors.PRIMARY}20`,
          borderColor: selected ? Colors.PRIMARY : `${Colors.PRIMARY}40`,
          textColor: selected ? Colors.WHITE : Colors.PRIMARY,
        };
      case 'success':
        return {
          backgroundColor: selected ? Colors.SUCCESS.DEFAULT : Colors.SUCCESS.LIGHT,
          borderColor: selected ? Colors.SUCCESS.DEFAULT : Colors.SUCCESS.DEFAULT,
          textColor: selected ? Colors.WHITE : Colors.SUCCESS.DEFAULT,
        };
      case 'error':
        return {
          backgroundColor: selected ? Colors.ERROR.DEFAULT : Colors.ERROR.LIGHT,
          borderColor: selected ? Colors.ERROR.DEFAULT : Colors.ERROR.DEFAULT,
          textColor: selected ? Colors.WHITE : Colors.ERROR.DEFAULT,
        };
      case 'warning':
        return {
          backgroundColor: selected ? Colors.WARNING.DEFAULT : Colors.WARNING.LIGHT,
          borderColor: selected ? Colors.WARNING.DEFAULT : Colors.WARNING.DEFAULT,
          textColor: selected ? Colors.WHITE : Colors.WARNING.DEFAULT,
        };
      case 'outlined':
        return {
          backgroundColor: selected ? Colors.PRIMARY : 'transparent',
          borderColor: Colors.PRIMARY,
          textColor: selected ? Colors.WHITE : Colors.PRIMARY,
        };
      default:
        return {
          backgroundColor: selected ? Colors.GRAY.MEDIUM : Colors.GRAY.LIGHT,
          borderColor: selected ? Colors.GRAY.DARK : Colors.GRAY.MEDIUM,
          textColor: selected ? Colors.WHITE : Colors.TEXT.PRIMARY,
        };
    }
  };

  // Get style based on size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.TINY / 2,
          paddingHorizontal: SPACING.SMALL,
          textStyle: Typography.TYPOGRAPHY.CAPTION,
          iconSize: 12,
        };
      case 'large':
        return {
          paddingVertical: SPACING.SMALL,
          paddingHorizontal: SPACING.MEDIUM,
          textStyle: Typography.TYPOGRAPHY.BODY,
          iconSize: 16,
        };
      default: // medium
        return {
          paddingVertical: SPACING.TINY,
          paddingHorizontal: SPACING.SMALL,
          textStyle: Typography.TYPOGRAPHY.BODY_SMALL,
          iconSize: 14,
        };
    }
  };

  const typeStyle = getTypeStyle();
  const sizeStyle = getSizeStyle();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: typeStyle.backgroundColor,
          borderColor: typeStyle.borderColor,
          opacity: disabled ? 0.6 : 1,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: onRemove 
            ? sizeStyle.paddingHorizontal / 1.5 
            : sizeStyle.paddingHorizontal,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text 
        style={[
          sizeStyle.textStyle,
          {
            color: typeStyle.textColor,
            fontWeight: Typography.FONT_WEIGHT.MEDIUM,
          },
          styles.label,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      
      {onRemove && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={onRemove}
          disabled={disabled}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Feather 
            name="x" 
            size={sizeStyle.iconSize} 
            color={typeStyle.textColor}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.PILL,
    borderWidth: 1,
    marginRight: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
  },
  iconContainer: {
    marginRight: SPACING.TINY,
  },
  label: {
    marginRight: 2,
  },
  removeButton: {
    marginLeft: SPACING.TINY / 2,
  },
});

export default Chip; 