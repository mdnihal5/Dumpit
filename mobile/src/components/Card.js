import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../theme';

/**
 * Custom Card component
 * 
 * @param {Object} props
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {boolean} props.elevated - Whether to show elevation shadow effect
 * @param {Object} props.style - Additional style for the card
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({
  onPress,
  elevated = true,
  style,
  children,
  ...props
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  elevated: {
    // Shadow for iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
});

export default Card; 