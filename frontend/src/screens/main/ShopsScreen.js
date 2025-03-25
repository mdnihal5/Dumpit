import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, setSearchQuery } from '../../store/slices/shopSlice';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const ShopsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { shops, filters, searchQuery } = useSelector((state) => state.shop);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [filteredShops, setFilteredShops] = useState([]);

  // Mock data for categories and sort options
  const categories = [
    'Electronics',
    'Fashion',
    'Home',
    'Beauty',
    'Sports',
    'Books',
    'Food',
  ];

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
    { label: 'Most Products', value: 'products' },
  ];

  useEffect(() => {
    // Mock API call to fetch shops
    const fetchShops = async () => {
      try {
        // Mock data
        const mockShops = [
          {
            id: '1',
            name: 'Tech Store',
            image: null,
            rating: 4.5,
            category: 'Electronics',
            productCount: 150,
            description: 'Your one-stop shop for all things tech',
            isOpen: true,
          },
          {
            id: '2',
            name: 'Fashion Boutique',
            image: null,
            rating: 4.8,
            category: 'Fashion',
            productCount: 200,
            description: 'Trendy fashion items for everyone',
            isOpen: true,
          },
          {
            id: '3',
            name: 'Home Decor',
            image: null,
            rating: 4.2,
            category: 'Home',
            productCount: 100,
            description: 'Beautiful home decoration items',
            isOpen: false,
          },
          // Add more mock shops as needed
        ];

        // Apply filters to mock data
        let filtered = [...mockShops];

        if (localFilters.category) {
          filtered = filtered.filter(s => s.category === localFilters.category);
        }

        if (localFilters.rating) {
          filtered = filtered.filter(s => s.rating >= localFilters.rating);
        }

        // Apply sorting
        switch (localFilters.sortBy) {
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
          case 'products':
            filtered.sort((a, b) => b.productCount - a.productCount);
            break;
          default:
            // Popular sorting (default)
            break;
        }

        setFilteredShops(filtered);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, [localFilters]);

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: null,
      rating: null,
      sortBy: 'popular',
    });
    dispatch(clearFilters());
  };

  const renderShop = ({ item }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate('ShopDetails', { shopId: item.id })}
    >
      <Image source={item.image} style={styles.shopImage} />
      <View style={styles.shopInfo}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopName}>{item.name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? COLORS.success : COLORS.error }
          ]}>
            <Text style={styles.statusText}>
              {item.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
        <Text style={styles.shopCategory}>{item.category}</Text>
        <Text style={styles.shopDescription}>{item.description}</Text>
        <View style={styles.shopFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.productCount}>{item.productCount} products</Text>
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
        <Text style={styles.headerTitle}>Shops</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredShops}
        renderItem={renderShop}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.shopList}
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
    justifyContent: 'space-between',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  filterButton: {
    padding: SIZES.small,
  },
  filterButtonText: {
    fontSize: FONTS.large,
  },
  shopList: {
    padding: SIZES.large,
  },
  shopCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.large,
    ...SHADOWS.light,
  },
  shopImage: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
  },
  shopInfo: {
    flex: 1,
    padding: SIZES.large,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  statusBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    fontSize: FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  shopCategory: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: SIZES.small,
  },
  shopDescription: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: SIZES.small,
  },
  shopFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  productCount: {
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

export default ShopsScreen; 