import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, BORDER_RADIUS, SPACING, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

const ProductCard = ({
  product,
  onPress,
  style,
  showVendor = true,
  showRating = true,
}) => {
  const {
    name,
    price,
    images,
    vendor,
    rating,
    reviews,
    discount,
    inStock,
  } = product;

  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.light, style]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
        {!inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        {showVendor && (
          <Text style={styles.vendorName} numberOfLines={1}>
            {vendor.name}
          </Text>
        )}
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{price}</Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>
              ₹{price + (price * discount) / 100}
            </Text>
          )}
        </View>
        {showRating && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={SIZES.small} color={COLORS.warning} />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({reviews})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.small,
  },
  discountText: {
    color: COLORS.background,
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.text.primary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.small,
  },
  outOfStockText: {
    color: COLORS.background,
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
  },
  content: {
    padding: SPACING.sm,
  },
  vendorName: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  productName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
  },
  originalPrice: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text.light,
    textDecorationLine: 'line-through',
    marginLeft: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs / 2,
  },
  reviews: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text.light,
    marginLeft: SPACING.xs / 2,
  },
});

export default ProductCard; 