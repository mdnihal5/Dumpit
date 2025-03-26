import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
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
  Loader 
} from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import vendorService from '../../services/vendorService';
import productService from '../../services/productService';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load featured vendors
      const vendorsResponse = await vendorService.getFeaturedVendors(5);
      if (vendorsResponse.success) {
        setFeaturedVendors(vendorsResponse.vendors);
      }
      
      // Load popular products
      const popularResponse = await productService.getProducts({ 
        sort: 'popularity',
        limit: 10
      });
      if (popularResponse.success) {
        setPopularProducts(popularResponse.products);
      }
      
      // Load new arrivals
      const newArrivalsResponse = await productService.getProducts({
        sort: '-createdAt',
        limit: 10
      });
      if (newArrivalsResponse.success) {
        setNewArrivals(newArrivalsResponse.products);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderVendorItem = ({ item }) => (
    <VendorCard
      vendor={item}
      onPress={() => navigation.navigate('VendorDetail', { vendorId: item._id })}
      style={styles.vendorCard}
    />
  );

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      style={styles.productCard}
    />
  );

  if (loading && !refreshing) {
    return <Loader fullscreen text="Loading..." />;
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
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search for products or vendors..."
          iconLeft={<Feather name="search" size={20} color={Colors.TEXT.SECONDARY} />}
          iconRight={
            <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
              <Feather name="sliders" size={20} color={Colors.TEXT.SECONDARY} />
            </TouchableOpacity>
          }
        />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.PRIMARY]}
            tintColor={Colors.PRIMARY}
          />
        }
      >
        {/* Featured Vendors */}
        <Section
          title="Featured Vendors"
          subtitle="Explore our trusted partners"
          rightText="See All"
          onRightPress={() => navigation.navigate('Vendors')}
        >
          <FlatList
            data={featuredVendors}
            renderItem={renderVendorItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </Section>
        
        {/* Popular Products */}
        <Section
          title="Popular Products"
          subtitle="Most in-demand items"
          rightText="See All"
          onRightPress={() => navigation.navigate('Products', { filter: 'popular' })}
        >
          <FlatList
            data={popularProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </Section>
        
        {/* New Arrivals */}
        <Section
          title="New Arrivals"
          subtitle="Just added to our collection"
          rightText="See All"
          onRightPress={() => navigation.navigate('Products', { filter: 'new' })}
        >
          <FlatList
            data={newArrivals}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
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
  searchContainer: {
    padding: SPACING.MEDIUM,
  },
  scrollContent: {
    paddingBottom: SPACING.LARGE,
  },
  horizontalListContent: {
    paddingRight: SPACING.MEDIUM,
  },
  vendorCard: {
    marginRight: SPACING.MEDIUM,
    minWidth: 180,
  },
  productCard: {
    marginRight: SPACING.MEDIUM,
  },
});

export default HomeScreen; 