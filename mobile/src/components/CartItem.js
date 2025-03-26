import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

/**
 * CartItem component for displaying items in the shopping cart
 * 
 * @param {Object} props
 * @param {Object} props.item - Cart item data
 * @param {Function} props.onIncrement - Function to call when + button is pressed
 * @param {Function} props.onDecrement - Function to call when - button is pressed
 * @param {Function} props.onRemove - Function to call when remove button is pressed
 * @param {Object} props.style - Additional style for the item container
 */
const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  style,
}) => {
  if (!item) return null;

  const {
    id,
    name,
    image,
    pricePerUnit,
    quantity,
    unit,
    taxPercentage,
  } = item;

  const totalPrice = pricePerUnit * quantity;
  const taxAmount = (totalPrice * taxPercentage) / 100;

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: image || 'https://via.placeholder.com/100' }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          <TouchableOpacity 
            onPress={() => onRemove && onRemove(id)}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.price}>₹{pricePerUnit.toFixed(2)} / {unit}</Text>
        
        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onDecrement && onDecrement(id)}
              disabled={quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onIncrement && onIncrement(id)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalPrice}>₹{totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 16,
    color: COLORS.error,
  },
  price: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quantity: {
    ...TYPOGRAPHY.body,
    paddingHorizontal: 8,
    fontWeight: '500',
    color: COLORS.text,
  },
  totalPrice: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default CartItem; 