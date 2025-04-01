import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../utils/theme';
import Header from '../components/Header';
import { productService } from '../api/services';

// Types for product data
interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Products'>,
  BottomTabScreenProps<MainTabParamList, 'Products'>
>;

const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  // States
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Map API response to our ProductData type
        const productData: ProductData[] = response.data.data.map((item: any) => ({
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || 'https://via.placeholder.com/150',
          category: item.category,
          stock: item.stock || 0,
          rating: item.rating
        }));
        setProducts(productData);
        setFilteredProducts(productData);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data in development
      if (__DEV__) {
        console.warn('Using mock product data');
        const mockProducts: ProductData[] = [
          {
            _id: '1',
            name: 'Recycled Wood Panels',
            description: 'High-quality recycled wood panels for eco-friendly construction.',
            price: 29.99,
            image: 'https://example.com/wood-panels.jpg',
            category: 'Wood',
            stock: 50,
            rating: 4.5,
          },
          {
            _id: '2',
            name: 'Reclaimed Brick Set',
            description: 'Reclaimed bricks perfect for sustainable building projects.',
            price: 0.99,
            image: 'https://example.com/bricks.jpg',
            category: 'Masonry',
            stock: 1000,
            rating: 4.2,
          },
          {
            _id: '3',
            name: 'Eco-Friendly Insulation',
            description: 'Environmentally friendly insulation made from recycled materials.',
            price: 44.99,
            image: 'https://example.com/insulation.jpg',
            category: 'Insulation',
            stock: 75,
            rating: 4.8,
          },
          {
            _id: '4',
            name: 'Salvaged Hardwood Flooring',
            description: 'Premium salvaged hardwood flooring for sustainable homes.',
            price: 5.99,
            image: 'https://example.com/flooring.jpg',
            category: 'Flooring',
            stock: 120,
            rating: 4.7,
          },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Navigate to product details
  const navigateToProductDetails = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  // Handle image error
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Render product item
  const renderProductItem = ({ item }: { item: ProductData }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProductDetails(item._id)}
    >
      <View style={styles.productImageContainer}>
        {imageErrors[item._id] ? (
          <View style={styles.placeholderImage}>
            <Feather name="box" size={40} color={colors.mediumGray} />
          </View>
        ) : (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            onError={() => handleImageError(item._id)}
          />
        )}
      </View>
      
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          {item.stock < 10 ? (
            <Text style={styles.lowStock}>Low Stock: {item.stock}</Text>
          ) : (
            <Text style={styles.inStock}>In Stock</Text>
          )}
        </View>
        
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="package" size={60} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptyText}>
        We couldn't find any products matching your search.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Products" showBack={false} />
      
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput as TextStyle}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.darkGray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Feather name="x" size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.sm,
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    width: '48%',
    ...shadows.sm,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 150,
    backgroundColor: colors.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  productContent: {
    padding: spacing.md,
  },
  productName: {
    ...typography.body1,
    fontWeight: '600' as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  } as TextStyle,
  productDescription: {
    ...typography.body2,
    color: colors.darkGray,
    marginBottom: spacing.sm,
  } as TextStyle,
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700' as '700',
  } as TextStyle,
  inStock: {
    ...typography.caption,
    color: colors.success,
  } as TextStyle,
  lowStock: {
    ...typography.caption,
    color: colors.warning,
  } as TextStyle,
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing.xs,
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  } as TextStyle,
  emptyText: {
    ...typography.body2,
    color: colors.darkGray,
    textAlign: 'center',
  } as TextStyle,
});

export default ProductsScreen; 