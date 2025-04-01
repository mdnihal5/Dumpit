import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../utils/theme';
import { shopService, productService } from '../services/api';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { formatCurrency, formatPhoneNumber } from '../utils/formatters';
import ProductCard from '../components/products/ProductCard';

const { width } = Dimensions.get('window');

interface ProductImage {
  url: string;
  _id: string;
}

interface Shop {
  _id: string;
  businessName: string;
  logo: string;
  coverImage: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  activeProductsCount: number;
  deliveryRadius: number;
  rating: number;
  description: string;
  categories: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  images: ProductImage[];
  discountPrice?: number;
  rating: number;
  category: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

const ShopScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shopId } = route.params;
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchShopDetails();
    fetchShopProducts();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await shopService.getShop(shopId);
      setShop(response.data);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      setShop(null);
      Alert.alert('Error', 'Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const fetchShopProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await shopService.getShopProducts(shopId);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching shop products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item._id)}
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  const renderRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name={star <= rating ? 'star' : 'star'}
            size={16}
            color={star <= rating ? colors.primary : colors.mediumGray}
            style={styles.star}
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Shop not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Vendor Information */}
        <View style={styles.shopInfo}>
          <View style={styles.coverImageContainer}>
            <Image
              source={{ uri: shop.coverImage || 'https://via.placeholder.com/500x200' }}
              style={styles.coverImage}
            />
          </View>
          
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: shop.logo || 'https://via.placeholder.com/100' }}
              style={styles.logo}
            />
          </View>
          
          <View style={styles.details}>
            <Text style={styles.businessName}>{shop.businessName}</Text>
            {renderRating(shop.rating)}
            
            <Text style={styles.description}>{shop.description}</Text>
            
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={colors.text} />
              <Text style={styles.infoText}>{`${shop.businessAddress.street}, ${shop.businessAddress.city}, ${shop.businessAddress.state} ${shop.businessAddress.zipCode}`}</Text>
            </View>
            
            {shop.contactPhone && (
              <View style={styles.infoRow}>
                <Feather name="phone" size={16} color={colors.text} />
                <Text style={styles.infoText}>{formatPhoneNumber(shop.contactPhone)}</Text>
              </View>
            )}
            
            {shop.contactEmail && (
              <View style={styles.infoRow}>
                <Feather name="mail" size={16} color={colors.text} />
                <Text style={styles.infoText}>{shop.contactEmail}</Text>
              </View>
            )}
            
            <View style={styles.categoriesContainer}>
              {shop.categories.map((category, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryBadge}
                  onPress={() => {
                    const mainNavigation = navigation.getParent();
                    if (mainNavigation) {
                      mainNavigation.navigate('Category', { 
                        categoryId: category, 
                        categoryName: category 
                      });
                    }
                  }}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          
          {productsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item._id}
              numColumns={2}
              contentContainerStyle={styles.productList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="package" size={50} color={colors.mediumGray} />
              <Text style={styles.emptyStateText}>No products available from this vendor</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: colors.background,
  },
  header: {
    height: 50,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.sm,
  },
  shopInfo: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coverImageContainer: {
    width: '100%',
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  details: {
    paddingTop: 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  businessName: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700' as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: colors.text,
  },
  description: {
    fontSize: typography.body1.fontSize,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.body2.fontSize,
    color: colors.secondary,
    marginLeft: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '500' as any,
  },
  productsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  productList: {
    paddingBottom: spacing.xl,
  },
  productCard: {
    flex: 1,
    margin: spacing.xs,
    maxWidth: '48%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    marginTop: spacing.md,
    fontSize: typography.body1.fontSize,
    color: colors.secondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.h3.fontSize,
    color: colors.error,
  }
});

export default ShopScreen; 