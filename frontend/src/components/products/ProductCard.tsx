import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';

interface ProductImage {
  url: string;
  _id: string;
}

interface ProductProps {
  product: {
    _id: string;
    name: string;
    pricePerUnit: number;
    discountPrice?: number;
    images: ProductImage[];
    rating?: number;
  };
  onPress?: () => void;
}

const ProductCard: React.FC<ProductProps> = ({ product, onPress }) => {
  const { name, pricePerUnit, discountPrice, images, rating } = product;
  const imageUrl = images && images.length > 0 ? images[0].url : 'https://via.placeholder.com/300';
  const discount = discountPrice ? Math.round(((pricePerUnit - discountPrice) / pricePerUnit) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatCurrency(discountPrice || pricePerUnit)}
          </Text>
          {discountPrice && (
            <Text style={styles.originalPrice}>
              {formatCurrency(pricePerUnit)}
            </Text>
          )}
        </View>
        {rating && (
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color={colors.primary} />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: colors.white,
    fontSize: typography.caption.fontSize,
    fontWeight: '700' as any,
  },
  infoContainer: {
    padding: spacing.sm,
  },
  name: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
    marginBottom: spacing.xs,
    height: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.body2.fontSize,
    fontWeight: '700' as any,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.caption.fontSize,
    color: colors.mediumGray,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    color: colors.text,
  }
});

export default ProductCard; 