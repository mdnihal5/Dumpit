import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, setSearchQuery } from '../../store/slices/productSlice';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const SearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { products, filters, searchQuery } = useSelector((state) => state.product);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchText, setSearchText] = useState(searchQuery);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock data for categories and price ranges
  const categories = [
    'Electronics',
    'Fashion',
    'Home',
    'Beauty',
    'Sports',
    'Books',
    'Food',
  ];

  const priceRanges = [
    { label: 'Under $10', value: { min: 0, max: 10 } },
    { label: '$10 - $50', value: { min: 10, max: 50 } },
    { label: '$50 - $100', value: { min: 50, max: 100 } },
    { label: '$100 - $500', value: { min: 100, max: 500 } },
    { label: 'Over $500', value: { min: 500, max: Infinity } },
  ];

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Highest Rated', value: 'rating' },
  ];

  useEffect(() => {
    // Mock API call to fetch products
    const fetchProducts = async () => {
      try {
        // Mock data
        const mockProducts = [
          {
            id: '1',
            name: 'Wireless Headphones',
            image: null,
            price: 99.99,
            shop: 'Tech Store',
            rating: 4.5,
            category: 'Electronics',
          },
          {
            id: '2',
            name: 'Smart Watch',
            image: null,
            price: 199.99,
            shop: 'Tech Store',
            rating: 4.7,
            category: 'Electronics',
          },
          {
            id: '3',
            name: 'Designer Bag',
            image: null,
            price: 299.99,
            shop: 'Fashion Boutique',
            rating: 4.6,
            category: 'Fashion',
          },
          // Add more mock products as needed
        ];

        // Apply filters to mock data
        let filtered = [...mockProducts];

        if (localFilters.category) {
          filtered = filtered.filter(p => p.category === localFilters.category);
        }

        if (localFilters.priceRange) {
          filtered = filtered.filter(p => 
            p.price >= localFilters.priceRange.min && 
            p.price <= localFilters.priceRange.max
          );
        }

        if (localFilters.rating) {
          filtered = filtered.filter(p => p.rating >= localFilters.rating);
        }

        // Apply sorting
        switch (localFilters.sortBy) {
          case 'priceAsc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'priceDesc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // Popular sorting (default)
            break;
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [localFilters]);

  const handleSearch = (text) => {
    setSearchText(text);
    dispatch(setSearchQuery(text));
    // Filter products based on search text
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase()) ||
      product.shop.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: null,
      priceRange: null,
      rating: null,
      sortBy: 'popular',
    });
    dispatch(clearFilters());
  };

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

  const renderFilters = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Categories</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      localFilters.category === category && styles.filterOptionSelected,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, category })}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.category === category && styles.filterOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <View style={styles.filterOptions}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.label}
                    style={[
                      styles.filterOption,
                      localFilters.priceRange?.min === range.value.min && styles.filterOptionSelected,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, priceRange: range.value })}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.priceRange?.min === range.value.min && styles.filterOptionTextSelected,
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <View style={styles.filterOptions}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      localFilters.sortBy === option.value && styles.filterOptionSelected,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, sortBy: option.value })}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.sortBy === option.value && styles.filterOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />

      {renderFilters()}
    </View>
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
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  backButton: {
    padding: SIZES.small,
  },
  backButtonText: {
    fontSize: FONTS.large,
    color: COLORS.text.primary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.large,
    marginRight: SIZES.small,
  },
  filterButton: {
    padding: SIZES.small,
  },
  filterButtonText: {
    fontSize: FONTS.large,
  },
  productList: {
    padding: SIZES.large,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.large,
    ...SHADOWS.light,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
  },
  productInfo: {
    flex: 1,
    padding: SIZES.large,
  },
  productName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  productShop: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: SIZES.small,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  productPrice: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productRating: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  closeButton: {
    fontSize: FONTS.large,
    color: COLORS.text.secondary,
  },
  filterContent: {
    padding: SIZES.large,
  },
  filterSection: {
    marginBottom: SIZES.large,
  },
  filterTitle: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.small,
  },
  filterOption: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
  },
  filterOptionTextSelected: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SIZES.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  modalButton: {
    flex: 1,
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.small,
  },
  clearButton: {
    backgroundColor: COLORS.lightGray,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  clearButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  applyButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SearchScreen; 