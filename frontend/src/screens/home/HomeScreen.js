import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  SearchBar, 
  Section, 
  ProductCard, 
  VendorCard, 
  Chip, 
  Loader 
} from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import { productService, categoryService, vendorService } from '../../services';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularVendors, setPopularVendors] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCategories(),
        loadFeaturedProducts(),
        loadPopularVendors(),
        loadNewArrivals()
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getFeaturedCategories(8);
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const response = await productService.getFeaturedProducts();
      if (response.success) {
        setFeaturedProducts(response.products);
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const loadPopularVendors = async () => {
    try {
      const response = await vendorService.getPopularVendors();
      if (response.success) {
        setPopularVendors(response.vendors);
      }
    } catch (error) {
      console.error('Error loading popular vendors:', error);
    }
  };

  const loadNewArrivals = async () => {
    try {
      const response = await productService.getNewestProducts();
      if (response.success) {
        setNewArrivals(response.products);
      }
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductList', { 
      categoryId: category._id,
      title: category.name 
    });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product._id });
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('VendorDetail', { vendorId: vendor._id });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
      setSearchQuery('');
    }
  };

  const renderCategoryItem = ({ item }) => (
    <Chip
      label={item.name}
      onPress={() => handleCategoryPress(item)}
      type="secondary"
      style={styles.categoryChip}
    />
  );

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

  const renderVendorItem = ({ item }) => (
    <VendorCard
      vendor={item}
      onPress={() => handleVendorPress(item)}
      style={styles.vendorCard}
      compact
    />
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="DumpIt"
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={Colors.TEXT.PRIMARY} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for products..."
            onSubmit={handleSearch}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            iconLeft={<Feather name="search" size={20} color={Colors.TEXT.SECONDARY} />}
          />
        </View>

        {/* Categories */}
        <Section
          title="Categories"
          onSeeAllPress={() => navigation.navigate('ProductList')}
        >
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </Section>

        {/* Featured Products */}
        <Section
          title="Featured Products"
          onSeeAllPress={() => navigation.navigate('ProductList', { filter: 'featured' })}
        >
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </Section>

        {/* Popular Vendors */}
        <Section
          title="Popular Vendors"
          onSeeAllPress={() => navigation.navigate('VendorList')}
        >
          <FlatList
            data={popularVendors}
            renderItem={renderVendorItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vendorsList}
          />
        </Section>

        {/* New Arrivals */}
        <Section
          title="New Arrivals"
          onSeeAllPress={() => navigation.navigate('ProductList', { filter: 'newest' })}
        >
          <FlatList
            data={newArrivals}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingBottom: SPACING.MEDIUM,
  },
  categoriesList: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  categoryChip: {
    marginRight: SPACING.SMALL,
  },
  productsList: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  productCard: {
    width: 160,
    marginRight: SPACING.MEDIUM,
  },
  vendorsList: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  vendorCard: {
    width: 200,
    marginRight: SPACING.MEDIUM,
  },
});

export default HomeScreen; 