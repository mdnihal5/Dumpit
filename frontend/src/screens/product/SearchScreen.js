import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  SearchBar, 
  ProductCard, 
  Loader, 
  Empty, 
  Chip 
} from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest First' },
  { id: 'rating', label: 'Highest Rated' },
];

const SearchScreen = ({ navigation, route }) => {
  const { query: initialQuery = '' } = route.params || {};
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const searchTimeout = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadCategories();
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (query = searchQuery, resetPage = true) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setProducts([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      if (resetPage) {
        setPage(1);
        searchProducts(query, 1);
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      } else {
        searchProducts(query, page);
      }
    }, 500);
  };

  const searchProducts = async (query, currentPage) => {
    try {
      const isFirstPage = currentPage === 1;
      
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Prepare sort parameter
      let sortParam;
      switch (sortBy) {
        case 'price_asc':
          sortParam = 'price';
          break;
        case 'price_desc':
          sortParam = '-price';
          break;
        case 'newest':
          sortParam = '-createdAt';
          break;
        case 'rating':
          sortParam = '-rating';
          break;
        default:
          sortParam = undefined;
      }

      // Prepare filters
      const filters = {};
      if (selectedCategories.length > 0) {
        filters.categories = selectedCategories;
      }

      const response = await productService.searchProducts(
        query, 
        currentPage, 
        20, 
        { 
          ...filters,
          sort: sortParam 
        }
      );

      if (response.success) {
        if (isFirstPage) {
          setProducts(response.products);
        } else {
          setProducts(prevProducts => [...prevProducts, ...response.products]);
        }
        setTotalPages(response.pages);
      } else {
        Alert.alert('Error', response.message || 'Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (loadingMore || page >= totalPages) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    searchProducts(searchQuery, nextPage);
  };

  const toggleCategoryFilter = (categoryId) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSortBy('relevance');
  };

  const applyFilters = () => {
    setShowFilters(false);
    setPage(1);
    handleSearch(searchQuery, true);
  };

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      style={styles.productCard}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <Empty
        title="No Products Found"
        message={
          searchQuery
            ? `We couldn't find any products matching "${searchQuery}"`
            : "Enter a search term to find products"
        }
        icon={<Feather name="search" size={60} color={Colors.TEXT.SECONDARY} />}
      />
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.PRIMARY} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Search"
        leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={Colors.TEXT.PRIMARY} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text, true);
          }}
          onSubmit={() => handleSearch(searchQuery, true)}
          onClear={() => {
            setSearchQuery('');
            setProducts([]);
          }}
          placeholder="Search for products..."
          iconLeft={<Feather name="search" size={20} color={Colors.TEXT.SECONDARY} />}
          iconRight={
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Feather 
                name="sliders" 
                size={20} 
                color={showFilters || selectedCategories.length > 0 ? Colors.PRIMARY : Colors.TEXT.SECONDARY} 
              />
            </TouchableOpacity>
          }
        />
      </View>
      
      {/* Search Status */}
      {(products.length > 0 || loading) && (
        <View style={styles.searchStatus}>
          <Text style={styles.resultsText}>
            {loading ? 'Searching...' : `${products.length} results`}
          </Text>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.sortText}>
              Sort: {SORT_OPTIONS.find(option => option.id === sortBy)?.label}
            </Text>
            <Feather name="chevron-down" size={16} color={Colors.TEXT.SECONDARY} />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Filter Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <ScrollView 
            style={styles.filterScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Categories</Text>
              <View style={styles.chipContainer}>
                {categories.map(category => (
                  <Chip
                    key={category._id}
                    label={category.name}
                    selected={selectedCategories.includes(category._id)}
                    onPress={() => toggleCategoryFilter(category._id)}
                    type="primary"
                  />
                ))}
              </View>
            </View>
            
            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              {SORT_OPTIONS.map(option => (
                <TouchableOpacity 
                  key={option.id}
                  style={[
                    styles.sortOption,
                    sortBy === option.id && styles.sortOptionSelected
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text 
                    style={[
                      styles.sortOptionText,
                      sortBy === option.id && styles.sortOptionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.id && (
                    <Feather name="check" size={18} color={Colors.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Product List */}
      {loading && page === 1 ? (
        <Loader />
      ) : (
        <FlatList
          ref={flatListRef}
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM,
    paddingBottom: SPACING.SMALL,
  },
  resultsText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    marginRight: SPACING.TINY,
  },
  filterPanel: {
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER.LIGHT,
    maxHeight: '60%',
  },
  filterScrollView: {
    padding: SPACING.MEDIUM,
  },
  filterSection: {
    marginBottom: SPACING.LARGE,
  },
  filterTitle: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.SMALL,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER.LIGHT,
  },
  sortOptionSelected: {
    borderBottomColor: Colors.PRIMARY,
  },
  sortOptionText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
  },
  sortOptionTextSelected: {
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.MEDIUM,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER.LIGHT,
  },
  resetButton: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.LARGE,
    borderWidth: 1,
    borderColor: Colors.BORDER.MEDIUM,
    borderRadius: 4,
  },
  resetButtonText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  applyButton: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.LARGE,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
  },
  applyButtonText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.WHITE,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  productList: {
    padding: SPACING.SMALL,
    flexGrow: 1,
  },
  productCard: {
    flex: 1,
    margin: SPACING.SMALL,
    maxWidth: '48%',
  },
  footerLoader: {
    paddingVertical: SPACING.LARGE,
    alignItems: 'center',
  },
});

export default SearchScreen; 