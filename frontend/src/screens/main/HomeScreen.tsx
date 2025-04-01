import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../../navigation/types';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
import useAuth from '../../hooks/useAuth';
import { colors, typography, spacing, shadows, borderRadius } from '../../utils/theme';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import {  Card, Divider, Badge } from 'react-native-paper';
import Header from '../../components/Header';
import productService from '../../api/productService';
import categoryService from '../../api/categoryService';
import { Product } from '../../types/auth';
import { Category } from '../../api/categoryService';
import { getProductImage } from '../../utils/assetUtils';
import HomeHeader from '../../components/HomeHeader';

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList, 'Home'>
>;

interface CategoryIcon {
  name: string;
  color: string;
  icon: React.ReactNode;
}

// Fix for the Badge component
const DiscountBadge: React.FC<{ discount: number }> = ({ discount }) => (
  <Badge style={styles.discountBadge}>{`${discount}% OFF`}</Badge>
);

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  // Predefined category icons
  const categoryIcons: { [key: string]: CategoryIcon } = {
    tools: {
      name: 'Tools',
      color: colors.brick,
      icon: <FontAwesome5 name="tools" size={24} color={colors.white} />,
    },
    hardware: {
      name: 'Hardware',
      color: colors.steel,
      icon: <FontAwesome5 name="hammer" size={24} color={colors.white} />,
    },
    paint: {
      name: 'Paint',
      color: colors.primary,
      icon: <MaterialCommunityIcons name="palette" size={24} color={colors.white} />,
    },
    plumbing: {
      name: 'Plumbing',
      color: colors.info,
      icon: <MaterialCommunityIcons name="pipe" size={24} color={colors.white} />,
    },
    electrical: {
      name: 'Electrical',
      color: colors.warning,
      icon: <MaterialCommunityIcons name="flash" size={24} color={colors.white} />,
    },
    wood: {
      name: 'Lumber',
      color: colors.wood,
      icon: <MaterialCommunityIcons name="tree" size={24} color={colors.white} />,
    },
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load featured products
        const productsResponse = await productService.getFeaturedProducts();
        if (productsResponse.success && productsResponse.data?.products) {
          setFeaturedProducts(productsResponse.data.products);
        } else {
          // Fallback products when API fails
          setFeaturedProducts([
            {
              _id: '1',
              name: 'Power Drill Set',
              description: 'Professional cordless drill with accessories',
              price: 129.99,
              discountPrice: 99.99,
              category: 'tools',
              images: [],
              inStock: true,
              quantity: 50,
              vendor: 'ToolMaster',
              ratings: [
                { user: 'user1', rating: 4.5 },
                { user: 'user2', rating: 5 }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '2',
              name: 'Paint Roller Kit',
              description: 'Complete paint roller set for walls and ceilings',
              price: 45.99,
              discountPrice: 39.99,
              category: 'paint',
              images: [],
              inStock: true,
              quantity: 100,
              vendor: 'PaintPro',
              ratings: [
                { user: 'user3', rating: 4 },
                { user: 'user4', rating: 4.5 }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '3',
              name: 'Pipe Wrench',
              description: 'Heavy-duty pipe wrench for plumbing',
              price: 59.99,
              discountPrice: undefined,
              category: 'plumbing',
              images: [],
              inStock: true,
              quantity: 35,
              vendor: 'PlumbRight',
              ratings: [
                { user: 'user5', rating: 5 },
                { user: 'user6', rating: 4.5 }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }

        // Load categories
        const categoriesResponse = await categoryService.getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        // In a real app, you would load recent orders here
      } catch (error) {
        console.error('Error loading home data:', error);
        // Set fallback data when error occurs
        setFeaturedProducts([
          {
            _id: '1',
            name: 'Power Drill Set',
            description: 'Professional cordless drill with accessories',
            price: 129.99,
            discountPrice: 99.99,
            category: 'tools',
            images: [],
            inStock: true,
            quantity: 50,
            vendor: 'ToolMaster',
            ratings: [
              { user: 'user1', rating: 4.5 },
              { user: 'user2', rating: 5 }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Paint Roller Kit',
            description: 'Complete paint roller set for walls and ceilings',
            price: 45.99,
            discountPrice: 39.99,
            category: 'paint',
            images: [],
            inStock: true,
            quantity: 100,
            vendor: 'PaintPro',
            ratings: [
              { user: 'user3', rating: 4 },
              { user: 'user4', rating: 4.5 }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Pipe Wrench',
            description: 'Heavy-duty pipe wrench for plumbing',
            price: 59.99,
            discountPrice: undefined,
            category: 'plumbing',
            images: [],
            inStock: true,
            quantity: 35,
            vendor: 'PlumbRight',
            ratings: [
              { user: 'user5', rating: 5 },
              { user: 'user6', rating: 4.5 }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const navigateToProductDetails = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const navigateToCategory = (categoryId: string) => {
    // Get the category name from categoryIcons
    const categoryName = categoryIcons[categoryId]?.name || 'Category';
    navigation.navigate('Category', { categoryId, categoryName });
  };

  const navigateToAllProducts = () => {
    console.log('Navigate to all products');
  };

  const navigateToAllOrders = () => {
    navigation.navigate('OrderHistory');
  };

  const handleSearchPress = () => {
    // @ts-ignore - Search screen navigation will be added later
    navigation.navigate('Search');
  };

  // Render a placeholder when loading
  if (isLoading) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <HomeHeader 
          userName={user?.name || user?.email?.split('@')[0]}
          avatarUrl={user?.avatar}
          onSearchPress={handleSearchPress}
          onMenuPress={() => {
            // @ts-ignore - Menu screen navigation will be added later
            navigation.navigate('Menu');
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <HomeHeader 
        userName={user?.name || user?.email?.split('@')[0]}
        avatarUrl={user?.avatar}
        onSearchPress={handleSearchPress}
        onMenuPress={() => {
          // @ts-ignore - Menu screen navigation will be added later
          navigation.navigate('Menu');
        }}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user?.name || 'User'}</Text>
          <Text style={styles.subtitle}>What are you building today?</Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesGrid}>
            {Object.entries(categoryIcons).map(([key, category]) => (
              <TouchableOpacity 
                key={key} 
                style={styles.categoryItem}
                onPress={() => navigateToCategory(key)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {category.icon}
                </View>
                <Text style={styles.categoryLabel}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={navigateToAllProducts}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <TouchableOpacity 
                  key={product._id} 
                  style={styles.productCard}
                  onPress={() => navigateToProductDetails(product._id)}
                >
                  <View style={styles.productImageContainer}>
                    <Image 
                      source={getProductImage(product.images?.[0], index % 3)} 
                      style={styles.productImageStyle} 
                    />
                    {product.discountPrice && (
                      <DiscountBadge 
                        discount={Math.round((1 - product.discountPrice / product.price) * 100)} 
                      />
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.productPrice}>
                      ${product.discountPrice?.toFixed(2) || product.price.toFixed(2)}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Feather name="star" size={12} color={colors.warning} />
                      <Text style={styles.ratingText}>
                        {product.ratings && product.ratings.length > 0
                          ? (product.ratings.reduce((total, rating) => total + rating.rating, 0) / product.ratings.length).toFixed(1)
                          : 'No ratings'} 
                        ({product.ratings?.length || 0})
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No featured products available</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={navigateToAllOrders}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Demo orders - in a real app these would come from an API */}
          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderItem}>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderNumber}>Order #12345</Text>
                  <Text style={styles.orderDate}>May 15, 2023</Text>
                  <Text style={styles.orderItems}>5 items - $235.50</Text>
                </View>
                <View style={styles.orderStatus}>
                  <Text style={styles.statusText}>Delivered</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderItem}>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderNumber}>Order #12346</Text>
                  <Text style={styles.orderDate}>May 10, 2023</Text>
                  <Text style={styles.orderItems}>3 items - $105.00</Text>
                </View>
                <View style={[styles.orderStatus, styles.processingStatus]}>
                  <Text style={styles.processingText}>Processing</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Special Offers Banner */}
          <TouchableOpacity style={styles.offerBanner}>
            <View style={styles.offerContent}>
              <View>
                <Text style={styles.offerTitle}>Special Offers!</Text>
                <Text style={styles.offerDescription}>Up to 25% off on selected paint products</Text>
              </View>
              <View style={styles.offerCTA}>
                <Text style={styles.offerCTAText}>Shop Now</Text>
                <Feather name="arrow-right" size={16} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>
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
  scrollView: {
    padding: spacing.md,
  },
  welcomeSection: {
    marginVertical: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "400",
    lineHeight: typography.lineHeights.sm,
    color: colors.darkGray,
  },
  username: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: "700",
    lineHeight: typography.lineHeights.xxl,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: "400",
    lineHeight: typography.lineHeights.md,
    color: colors.darkGray,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    lineHeight: typography.lineHeights.xl,
    color: colors.text,
  },
  seeAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "600",
    lineHeight: typography.lineHeights.sm,
    color: colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...shadows.md,
  },
  categoryLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "400",
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  productsContainer: {
    paddingRight: spacing.md,
  },
  productCard: {
    width: 160,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    ...shadows.md,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  productImageStyle: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.fontSizes.md,
    color: colors.primary,
    fontWeight: "700",
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSizes.xs,
    color: colors.darkGray,
    marginLeft: spacing.xs,
  },
  orderCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontSize: typography.fontSizes.md,
    fontWeight: "500",
  },
  orderDate: {
    fontSize: typography.fontSizes.xs,
    color: colors.darkGray,
    marginVertical: spacing.xs,
  },
  orderItems: {
    fontSize: typography.fontSizes.md,
    fontWeight: "400",
  },
  orderStatus: {
    backgroundColor: colors.success + '20', // 20% opacity
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    color: colors.success,
    fontSize: typography.fontSizes.xs,
    fontWeight: "500",
  },
  processingStatus: {
    backgroundColor: colors.warning + '20', // 20% opacity
  },
  processingText: {
    color: colors.warning,
    fontSize: typography.fontSizes.xs,
    fontWeight: "500",
  },
  offerBanner: {
    height: 100,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    marginTop: spacing.md,
    ...shadows.md,
    overflow: 'hidden',
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    height: '100%',
  },
  offerTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "600",
    color: colors.white,
    marginBottom: spacing.xs,
  },
  offerDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "400",
    color: colors.white,
    opacity: 0.8,
  },
  offerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  offerCTAText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
    color: colors.white,
    marginRight: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "400",
    color: colors.darkGray,
    marginTop: spacing.md,
  },
  noProductsContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: typography.fontSizes.md,
    fontWeight: "400",
    color: colors.darkGray,
  },
});

export default HomeScreen; 