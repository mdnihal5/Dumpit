import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS, SHADOWS } from '../styles';
import { DEFAULT_PRODUCT_IMAGE } from '../config';

const ProductCard = ({
  product,
  onPress,
  style,
  compact = false,
  ...props
}) => {
  if (!product) return null;
  
  const { 
    name, 
    price,
    discountPrice,
    images,
    vendor,
    rating,
    ratingCount,
    stock
  } = product;
  
  // Calculate discount percentage if discount price is available
  const discountPercentage = discountPrice && price ? 
    Math.round((1 - discountPrice / price) * 100) : null;
  
  const imageUrl = images && images.length > 0 ? images[0] : DEFAULT_PRODUCT_IMAGE;
  const isOutOfStock = stock === 0;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact ? styles.compactContainer : null,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {discountPercentage && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>
      
      {/* Product Info */}
      <View style={styles.infoContainer}>
        {/* Vendor name if available */}
        {vendor && vendor.name && (
          <Text style={styles.vendorName} numberOfLines={1}>
            {vendor.name}
          </Text>
        )}
        
        {/* Product name */}
        <Text style={styles.productName} numberOfLines={compact ? 1 : 2}>
          {name}
        </Text>
        
        {/* Price and discount */}
        <View style={styles.priceContainer}>
          {discountPrice ? (
            <>
              <Text style={styles.discountPrice}>
                ${discountPrice.toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>
                ${price.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text style={styles.price}>
              ${price.toFixed(2)}
            </Text>
          )}
        </View>
        
        {/* Ratings if available */}
        {rating > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
            {ratingCount > 0 && (
              <Text style={styles.ratingCount}>({ratingCount})</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 170,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
    marginBottom: SPACING.MEDIUM,
    ...SHADOWS.SMALL,
  },
  compactContainer: {
    width: 140,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.XSMALL,
    left: SPACING.XSMALL,
    backgroundColor: Colors.DANGER,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  discountText: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.INVERSE,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...Typography.TYPOGRAPHY.BUTTON_SMALL,
    color: Colors.TEXT.INVERSE,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  infoContainer: {
    padding: SPACING.SMALL,
  },
  vendorName: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    marginBottom: SPACING.TINY,
  },
  productName: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.PRIMARY,
    marginBottom: SPACING.XSMALL,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XSMALL,
  },
  price: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  discountPrice: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginRight: SPACING.XSMALL,
  },
  originalPrice: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.WARNING,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginRight: SPACING.TINY,
  },
  ratingCount: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
  },
});

export default ProductCard; 