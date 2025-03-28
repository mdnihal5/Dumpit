import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { productService } from '../services/api';
import { colors, typography, spacing } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '../utils/formatters';
import { RootStackParamList, RootScreenNavigationProp } from '../types/navigation';

const { width } = Dimensions.get('window');

interface ProductImage {
  _id: string;
  url: string;
}

interface BulkPrice {
  minQuantity: number;
  pricePerUnit: number;
}

interface ProductDiscount {
  percentage: number;
  validUntil: string;
}

interface ProductInventory {
  available: number;
  reserved: number;
  total: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  baseUnit: string;
  pricePerUnit: number;
  taxPercentage: number;
  images: ProductImage[];
  inventory: ProductInventory;
  discount?: ProductDiscount;
  bulkPricing?: BulkPrice[];
}

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;

const ProductScreen = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const navigation = useNavigation<RootScreenNavigationProp>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [route.params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { id } = route.params;
      const response = await productService.getProduct(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    // To be implemented: Add to cart functionality
    Alert.alert('Success', `${product.name} added to cart`);
  };

  // Calculate original price based on discount
  const getOriginalPrice = (currentPrice: number, discount?: ProductDiscount) => {
    if (!discount || !discount.percentage) return currentPrice;
    return currentPrice / (1 - discount.percentage / 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[selectedImageIndex]?.url || 'https://via.placeholder.com/400' }}
          style={styles.mainImage}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {product.images.map((image, index) => (
            <TouchableOpacity
              key={image._id}
              onPress={() => setSelectedImageIndex(index)}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.selectedThumbnail,
              ]}
            >
              <Image source={{ uri: image.url }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatCurrency(product.pricePerUnit)}
          </Text>
          {product.discount && product.discount.percentage > 0 && (
            <View style={styles.discountContainer}>
              <Text style={styles.originalPrice}>
                {formatCurrency(getOriginalPrice(product.pricePerUnit, product.discount))}
              </Text>
              <Text style={styles.discountText}>
                {product.discount.percentage}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Specifications */}
        <View style={styles.specsContainer}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Icon name="package-variant" size={24} color={colors.primary} />
              <Text style={styles.specLabel}>Category</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specItem}>
              <Icon name="scale" size={24} color={colors.primary} />
              <Text style={styles.specLabel}>Unit</Text>
              <Text style={styles.specValue}>{product.baseUnit}</Text>
            </View>
            <View style={styles.specItem}>
              <Icon name="package-variant-closed" size={24} color={colors.primary} />
              <Text style={styles.specLabel}>Stock</Text>
              <Text style={styles.specValue}>{product.inventory.available}</Text>
            </View>
            <View style={styles.specItem}>
              <Icon name="percent" size={24} color={colors.primary} />
              <Text style={styles.specLabel}>Tax</Text>
              <Text style={styles.specValue}>{product.taxPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Bulk Pricing */}
        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <View style={styles.bulkPricingContainer}>
            <Text style={styles.sectionTitle}>Bulk Pricing</Text>
            {product.bulkPricing.map((bulk, index) => (
              <View key={index} style={styles.bulkItem}>
                <Text style={styles.bulkText}>
                  {bulk.minQuantity}+ units
                </Text>
                <Text style={styles.bulkPrice}>
                  {formatCurrency(bulk.pricePerUnit)} per unit
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.h2,
    color: colors.error,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: colors.white,
  },
  mainImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    padding: spacing.s,
    height: '20%',
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: spacing.s,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  selectedThumbnail: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  infoContainer: {
    padding: spacing.l,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.s,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.l,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
    marginRight: spacing.m,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    ...typography.body1,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: spacing.s,
  },
  discountText: {
    ...typography.body2,
    color: colors.success,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  specsContainer: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.m,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specItem: {
    width: '48%',
    backgroundColor: colors.white,
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.m,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  specValue: {
    ...typography.body1,
    color: colors.text,
    marginTop: spacing.xs,
  },
  bulkPricingContainer: {
    marginBottom: spacing.l,
  },
  bulkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.s,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bulkText: {
    ...typography.body1,
    color: colors.text,
  },
  bulkPrice: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.l,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body2.fontSize,
    fontWeight: '600' as any,
  },
});

export default ProductScreen; 