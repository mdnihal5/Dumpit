import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../styles';

const QuantitySelector = ({
  quantity = 1,
  min = 1,
  max = 999,
  onChangeQuantity,
  size = 'medium',
  style,
  disabled = false,
}) => {
  const handleIncrement = () => {
    if (!disabled && quantity < max) {
      onChangeQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && quantity > min) {
      onChangeQuantity(quantity - 1);
    }
  };

  // Determine button size and text size based on size prop
  const getStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          button: styles.buttonSmall,
          text: styles.textSmall,
          icon: 14
        };
      case 'large':
        return {
          container: styles.containerLarge,
          button: styles.buttonLarge,
          text: styles.textLarge,
          icon: 20
        };
      default: // medium
        return {
          container: styles.containerMedium,
          button: styles.buttonMedium,
          text: styles.textMedium,
          icon: 16
        };
    }
  };

  const sizeStyles = getStyles();
  const isMinQuantity = quantity <= min;
  const isMaxQuantity = quantity >= max;

  return (
    <View style={[styles.container, sizeStyles.container, style]}>
      <TouchableOpacity 
        style={[
          styles.button, 
          sizeStyles.button,
          styles.buttonLeft,
          (disabled || isMinQuantity) && styles.buttonDisabled
        ]} 
        onPress={handleDecrement}
        disabled={disabled || isMinQuantity}
      >
        <Feather 
          name="minus" 
          size={sizeStyles.icon} 
          color={(disabled || isMinQuantity) ? Colors.TEXT.DISABLED : Colors.PRIMARY} 
        />
      </TouchableOpacity>
      
      <View style={styles.quantityContainer}>
        <Text style={[
          styles.quantity, 
          sizeStyles.text,
          disabled && styles.textDisabled
        ]}>
          {quantity}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          sizeStyles.button,
          styles.buttonRight,
          (disabled || isMaxQuantity) && styles.buttonDisabled
        ]} 
        onPress={handleIncrement}
        disabled={disabled || isMaxQuantity}
      >
        <Feather 
          name="plus" 
          size={sizeStyles.icon} 
          color={(disabled || isMaxQuantity) ? Colors.TEXT.DISABLED : Colors.PRIMARY} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER.LIGHT,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
  },
  containerSmall: {
    height: 28,
  },
  containerMedium: {
    height: 36,
  },
  containerLarge: {
    height: 44,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND.LIGHT,
  },
  buttonLeft: {
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER.LIGHT,
  },
  buttonRight: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.BORDER.LIGHT,
  },
  buttonSmall: {
    width: 28,
    height: 28,
  },
  buttonMedium: {
    width: 36,
    height: 36,
  },
  buttonLarge: {
    width: 44,
    height: 44,
  },
  buttonDisabled: {
    backgroundColor: Colors.BACKGROUND.DISABLED,
  },
  quantityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND.DEFAULT,
  },
  quantity: {
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    color: Colors.TEXT.PRIMARY,
  },
  textSmall: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
  },
  textMedium: {
    ...Typography.TYPOGRAPHY.BODY,
  },
  textLarge: {
    ...Typography.TYPOGRAPHY.H5,
  },
  textDisabled: {
    color: Colors.TEXT.DISABLED,
  },
});

export default QuantitySelector; 