import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { SearchBar, ProductCard, VendorCard, Section, Header } from '../../components';
import { fetchProducts, fetchCategories, fetchPromotions } from '../../redux/slices/productSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, categories, promotions, loading } = useSelector((state) => state.products);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [dispatch]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        dispatch(fetchProducts()).unwrap(),
        dispatch(fetchCategories()).unwrap(),
        dispatch(fetchPromotions()).unwrap(),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const renderPromotionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.promotionItem}
      onPress={() => navigation.navigate('ProductList', { promotion: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.promotionImage} 
        resizeMode="cover"
      />
      <View style={styles.promotionOverlay}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('ProductList', { category: item.id })}
    >
      <View style={styles.categoryIconContainer}>
        <Image source={{ uri: item.iconUrl }} style={styles.categoryIcon} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const featuredProducts = products?.filter(product => product.featured) || [];
  const featuredVendors = products?.reduce((vendors, product) => {
    if (product.vendor && !vendors.find(v => v.id === product.vendor.id)) {
      vendors.push(product.vendor);
    }
    return vendors;
  }, []).slice(0, 5) || [];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="DumpIt"
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}</Text>
          <Text style={styles.subtitle}>Find construction materials for your project</Text>
        </View>

        <SearchBar
          placeholder="Search for products..."
          onPress={() => navigation.navigate('Search')}
        />

        {/* Promotions Carousel */}
        <Section title="Special Offers">
          <FlatList
            horizontal
            data={promotions || []}
            renderItem={renderPromotionItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No promotions available</Text>
              </View>
            }
          />
        </Section>

        {/* Categories */}
        <Section title="Categories">
          <FlatList
            horizontal
            data={categories || []}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No categories available</Text>
              </View>
            }
          />
        </Section>

        {/* Featured Products */}
        <Section 
          title="Featured Products" 
          actionText="See All"
          onActionPress={() => navigation.navigate('ProductList', { featured: true })}
        >
          <FlatList
            horizontal
            data={featuredProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => 
                  navigation.navigate('ProductDetails', { productId: item.id })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No featured products available</Text>
              </View>
            }
          />
        </Section>

        {/* Featured Vendors */}
        <Section 
          title="Popular Vendors" 
          actionText="See All"
          onActionPress={() => navigation.navigate('VendorList')}
        >
          <FlatList
            horizontal
            data={featuredVendors}
            renderItem={({ item }) => (
              <VendorCard
                vendor={item}
                onPress={() => 
                  navigation.navigate('VendorDetails', { vendorId: item.id })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vendorsList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No vendors available</Text>
              </View>
            }
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 2,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: SIZES.padding,
  },
  greetingContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  greeting: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  promotionsList: {
    paddingHorizontal: SIZES.padding,
  },
  promotionItem: {
    width: SIZES.width * 0.85,
    height: 180,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  promotionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  promotionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  promotionSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.white,
    marginTop: 4,
  },
  categoriesList: {
    paddingHorizontal: SIZES.padding,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SIZES.padding * 1.5,
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: SIZES.padding,
  },
  vendorsList: {
    paddingHorizontal: SIZES.padding,
  },
  emptyList: {
    width: SIZES.width - SIZES.padding * 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen; 