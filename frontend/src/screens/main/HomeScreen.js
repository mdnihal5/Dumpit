import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFeaturedShops, setFeaturedProducts } from '../../store/slices/shopSlice';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { featuredShops, featuredProducts } = useSelector((state) => state.shop);
  const [banners] = useState([
    {
      id: '1',
      image: null,
      title: 'Special Offers',
      description: 'Get up to 50% off on selected items',
    },
    {
      id: '2',
      image: null,
      title: 'New Arrivals',
      description: 'Check out our latest products',
    },
    {
      id: '3',
      image: null,
      title: 'Featured Shops',
      description: 'Discover top-rated shops',
    },
  ]);

  useEffect(() => {
    // TODO: Implement actual API calls
    const fetchData = async () => {
      try {
        // Mock data for featured shops
        const mockShops = [
          {
            id: '1',
            name: 'Tech Store',
            image: null,
            rating: 4.5,
            category: 'Electronics',
          },
          {
            id: '2',
            name: 'Fashion Boutique',
            image: null,
            rating: 4.8,
            category: 'Fashion',
          },
          {
            id: '3',
            name: 'Home Decor',
            image: null,
            rating: 4.2,
            category: 'Home',
          },
        ];

        // Mock data for featured products
        const mockProducts = [
          {
            id: '1',
            name: 'Wireless Headphones',
            image: null,
            price: 99.99,
            shop: 'Tech Store',
            rating: 4.5,
          },
          {
            id: '2',
            name: 'Smart Watch',
            image: null,
            price: 199.99,
            shop: 'Tech Store',
            rating: 4.7,
          },
          {
            id: '3',
            name: 'Designer Bag',
            image: null,
            price: 299.99,
            shop: 'Fashion Boutique',
            rating: 4.6,
          },
        ];

        dispatch(setFeaturedShops(mockShops));
        dispatch(setFeaturedProducts(mockProducts));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const renderBanner = ({ item }) => (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={() => navigation.navigate('Search', { category: item.title })}
    >
      <Image source={item.image} style={styles.bannerImage} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderShop = ({ item }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate('ShopDetails', { shopId: item.id })}
    >
      <Image source={item.image} style={styles.shopImage} />
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopCategory}>{item.category}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productShop}>{item.shop}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Dumpit</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Banners</Text>
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Shops</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Shops')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredShops}
          renderItem={renderShop}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.large,
  },
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  searchButton: {
    padding: SIZES.small,
  },
  searchButtonText: {
    fontSize: FONTS.large,
    color: COLORS.text.primary,
  },
  section: {
    padding: SIZES.large,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  seeAllButton: {
    fontSize: FONTS.large,
    color: COLORS.text.secondary,
  },
  bannerContainer: {
    width: width,
    height: width,
    borderRadius: SIZES.large,
    overflow: 'hidden',
    marginRight: SIZES.large,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.large,
  },
  bannerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  bannerDescription: {
    fontSize: FONTS.large,
    color: COLORS.text.primary,
  },
  shopCard: {
    width: width,
    height: width,
    borderRadius: SIZES.large,
    overflow: 'hidden',
    marginRight: SIZES.large,
  },
  shopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  shopInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.large,
  },
  shopName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  shopCategory: {
    fontSize: FONTS.large,
    color: COLORS.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  rating: {
    fontSize: FONTS.large,
    color: COLORS.text.primary,
  },
  productCard: {
    width: width,
    height: width,
    borderRadius: SIZES.large,
    overflow: 'hidden',
    marginRight: SIZES.large,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.large,
  },
  productName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  productShop: {
    fontSize: FONTS.large,
    color: COLORS.text.secondary,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  productRating: {
    fontSize: FONTS.large,
    color: COLORS.text.primary,
  },
}); 