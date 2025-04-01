import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';
import { API_URL } from '@env';
import { RootStackParamList } from '../../navigation/types';

type ProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

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
    vendor?: {
      businessName?: string;
      name?: string;
    };
    inventory?: {
      available: number;
    };
  };
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - (spacing.lg * 3)) / 2; // For 2 cards per row with spacing

const ProductCard: React.FC<ProductProps> = ({ product, onPress }) => {
  const navigation = useNavigation<ProductNavigationProp>();
  const { name, pricePerUnit, discountPrice, images, rating, vendor, inventory } = product;
  
  // Format image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, add the base URL
    return `${API_URL}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
  };
  
  const imageUrl = images && images.length > 0 
    ? getImageUrl(images[0].url) 
    : 'https://via.placeholder.com/300';
    
  const discount = discountPrice ? Math.round(((pricePerUnit - discountPrice) / pricePerUnit) * 100) : 0;
  
  const isLowStock = inventory && inventory.available <= 5 && inventory.available > 0;
  const isOutOfStock = inventory && inventory.available === 0;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to product detail screen
      navigation.navigate('ProductDetails', { productId: product._id });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
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
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        
        {vendor && (vendor.businessName || vendor.name) && (
          <Text style={styles.vendorName} numberOfLines={1}>
            {vendor.businessName || vendor.name}
          </Text>
        )}
        
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
        
        <View style={styles.bottomRow}>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Feather name="star" size={14} color={colors.primary} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
          
          {isLowStock && (
            <Text style={styles.lowStockText}>Low Stock!</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: spacing.xs,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
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
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: colors.white,
    fontSize: typography.caption.fontSize,
    fontWeight: '700' as any,
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
    color: colors.white,
    fontSize: typography.body2.fontSize,
    fontWeight: '700' as any,
  },
  infoContainer: {
    padding: spacing.md,
  },
  name: {
    fontSize: typography.body2.fontSize,
    fontWeight: '500' as any,
    color: colors.text,
    marginBottom: spacing.xs,
    height: 40,
  },
  vendorName: {
    fontSize: typography.caption.fontSize,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.body1.fontSize,
    fontWeight: '700' as any,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.caption.fontSize,
    color: colors.mediumGray,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    color: colors.text,
  },
  lowStockText: {
    fontSize: typography.caption.fontSize,
    color: colors.warning,
    fontWeight: '500' as any,
  }
});

export default ProductCard; 