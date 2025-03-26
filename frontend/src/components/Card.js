import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, SPACING, BORDER_RADIUS, SHADOWS } from '../styles';

const Card = ({
  children,
  style,
  onPress,
  activeOpacity = 0.7,
  variant = 'default',
  noPadding = false,
  ...props
}) => {
  // Determine card style based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlinedCard;
      case 'elevated':
        return styles.elevatedCard;
      case 'flat':
        return styles.flatCard;
      default:
        return styles.defaultCard;
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyle(),
    noPadding && styles.noPadding,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  defaultCard: {
    ...SHADOWS.SMALL,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: Colors.BORDER.LIGHT,
  },
  elevatedCard: {
    ...SHADOWS.MEDIUM,
  },
  flatCard: {
    // No shadow or border
  },
  noPadding: {
    padding: 0,
  },
});

export default Card; 