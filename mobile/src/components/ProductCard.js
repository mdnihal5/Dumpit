import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';
import Card from './Card';

/**
 * ProductCard component for displaying product information
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Function} props.onAddToCart - Function to call when add to cart button is pressed
 * @param {Object} props.style - Additional style for the card
 */
const ProductCard = ({
  product,
  onPress,
  onAddToCart,
  style,
}) => {
  if (!product) return null;

  const {
    name,
    pricePerUnit,
    baseUnit,
    images,
    vendor,
    averageRating,
    discount,
  } = product;

  const imageUrl = images && images.length > 0 
    ? images[0].url 
    : 'https://via.placeholder.com/150';

  const vendorName = vendor?.businessName || 'Unknown Vendor';
  
  // Calculate discounted price if applicable
  const hasDiscount = discount && discount.percentage > 0;
  const discountedPrice = hasDiscount 
    ? pricePerUnit - (pricePerUnit * discount.percentage / 100) 
    : null;

  return (
    <Card 
      onPress={onPress} 
      style={[styles.container, style]}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.vendor} numberOfLines={1}>{vendorName}</Text>
        
        <View style={styles.priceRow}>
          <View>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                ₹{pricePerUnit.toFixed(2)}
              </Text>
            )}
            <Text style={styles.price}>
              ₹{(discountedPrice || pricePerUnit).toFixed(2)} 
              <Text style={styles.unit}>/{baseUnit}</Text>
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToCart && onAddToCart(product)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {discount.percentage}% OFF
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    padding: 0,
    overflow: 'hidden',
    marginRight: SIZES.margin,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  content: {
    padding: 12,
  },
  name: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  vendor: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  originalPrice: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textDecorationLine: 'line-through',
  },
  unit: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ProductCard; 