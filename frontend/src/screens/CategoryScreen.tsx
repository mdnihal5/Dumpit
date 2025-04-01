import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Header from '../components/Header';
import { categoryService, productService } from '../services/api';
import { colors, spacing } from '../utils/theme';
import commonStyles from '../utils/commonStyles';
import ProductCard from '../components/products/ProductCard';

type Props = NativeStackScreenProps<MainStackParamList, 'Category'>;

interface ProductImage {
  url: string;
  _id: string;
}

interface Product {
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
}

const CategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoryProducts(categoryId);
      
      if (response.data && response.data.success) {
        setProducts(response.data.data);
      } else {
        Alert.alert('Error', 'Failed to load category products');
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
      Alert.alert('Error', 'Failed to load category products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategoryProducts();
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item._id)}
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={commonStyles.emptyContainer}>
      <Text style={commonStyles.emptyTitle}>No Products Found</Text>
      <Text style={commonStyles.emptyText}>
        There are no products in this category yet.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header 
        title={categoryName || 'Category'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      
      {loading && !refreshing ? (
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productGrid}
          numColumns={2}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productGrid: {
    padding: spacing.sm,
  },
  productItem: {
    flex: 1,
    margin: spacing.xs,
    maxWidth: '50%',
  },
});

export default CategoryScreen; 