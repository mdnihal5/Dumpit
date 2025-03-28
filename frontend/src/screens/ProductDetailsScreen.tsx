import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { productService } from '../services/api';
import { colors, spacing, shadows, borderRadius, typography } from '../utils/theme';
import Header from '../components/Header';
import { formatCurrency } from '../utils/formatters';

// Get screen dimensions
const { width } = Dimensions.get('window');

interface Product {
  _id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  images: Array<{ url: string }>;
  category: string;
  vendor: {
    _id: string;
    name: string;
  };
}

type Props = NativeStackScreenProps<MainStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      console.log(`Fetching product details for ID: ${productId}`);
      const response = await productService.getProduct(productId);

      if (response.data && response.data.success) {
        console.log('Product details fetched successfully');
        setProduct(response.data.data);
      } else {
        console.error('Failed to fetch product details, API returned:', response.data);
        Alert.alert('Error', 'Unable to load product details');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Unable to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Add to cart functionality here
    Alert.alert('Success', `${product.name} added to cart`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={colors.error} />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={product.name} 
        showBack={true} 
        onBackPress={() => navigation.goBack()} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images[activeImageIndex]?.url || 'https://via.placeholder.com/400' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {product.images.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailsContainer}
              contentContainerStyle={styles.thumbnailsContent}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnailWrapper,
                    activeImageIndex === index && styles.activeThumbnail
                  ]}
                  onPress={() => setActiveImageIndex(index)}
                >
                  <Image 
                    source={{ uri: image.url }} 
                    style={styles.thumbnailImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{formatCurrency(product.pricePerUnit)}</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.vendorLink}
              onPress={() => navigation.navigate('Shop', { shopId: product.vendor._id })}
            >
              <Feather name="shopping-bag" size={14} color={colors.primary} />
              <Text style={styles.vendorText}>{product.vendor.name}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
          
          <View style={styles.divider} />
          
          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Feather name="shopping-cart" size={18} color={colors.white} />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    color: colors.text,
    marginVertical: spacing.md,
  },
  backButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: '500',
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: colors.white,
  },
  productImage: {
    width: '100%',
    height: '85%',
  },
  thumbnailsContainer: {
    height: '15%',
    paddingHorizontal: spacing.sm,
  },
  thumbnailsContent: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  thumbnailWrapper: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    borderWidth: 2,
    borderColor: colors.transparent,
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    marginTop: -borderRadius.lg,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  productName: {
    flex: 1,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text,
    marginRight: spacing.md,
  },
  productPrice: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium as any,
  },
  vendorLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as any,
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.md,
    color: colors.textSecondary,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    ...shadows.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    marginLeft: spacing.sm,
  },
});

export default ProductDetailsScreen; 