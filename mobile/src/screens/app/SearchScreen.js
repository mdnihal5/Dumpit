import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { ProductCard } from '../../components';
import { searchProducts } from '../../redux/slices/productSlice';

const SearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    // Load recent searches from AsyncStorage
    loadRecentSearches();
    
    // If there's an initial query, perform search
    if (route.params?.query) {
      handleSearch(route.params.query);
    }
  }, [route.params?.query]);
  
  useEffect(() => {
    // Debounce search as user types
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        handleSearch(searchQuery);
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);
  
  const loadRecentSearches = async () => {
    // In a real app, this would load from AsyncStorage
    // For now we'll use mock data
    setRecentSearches(['cement', 'bricks', 'paints', 'tiles']);
  };
  
  const saveSearchToRecent = (query) => {
    if (!query.trim()) return;
    
    // Don't add duplicates
    if (!recentSearches.includes(query.toLowerCase())) {
      const updated = [query.toLowerCase(), ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      // In a real app, save to AsyncStorage
    }
  };
  
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await dispatch(searchProducts({ query })).unwrap();
      setSearchResults(result);
      saveSearchToRecent(query);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };
  
  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };
  
  const handleRemoveRecentSearch = (query) => {
    const updated = recentSearches.filter(item => item !== query);
    setRecentSearches(updated);
    // In a real app, save to AsyncStorage
  };
  
  const renderRecentSearches = () => (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={() => setRecentSearches([])}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {recentSearches.length > 0 ? (
        recentSearches.map((item, index) => (
          <View key={index} style={styles.recentItem}>
            <TouchableOpacity 
              style={styles.recentItemContent}
              onPress={() => handleRecentSearchPress(item)}
            >
              <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.recentItemText}>{item}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleRemoveRecentSearch(item)}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noRecentText}>No recent searches</Text>
      )}
    </View>
  );
  
  const renderPopularCategories = () => (
    <View style={styles.popularContainer}>
      <Text style={styles.popularTitle}>Popular Categories</Text>
      <View style={styles.categoriesGrid}>
        {['Cement', 'Bricks', 'Sand', 'Steel', 'Pipes', 'Paints'].map((category, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('ProductList', { search: category })}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderSearchResults = () => (
    <FlatList
      data={searchResults}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          layout="horizontal"
          style={styles.productCard}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.resultsContainer}
      ListEmptyComponent={
        isSearching && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try searching with different keywords</Text>
          </View>
        ) : null
      }
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {searchResults.length > 0 || isSearching ? (
            renderSearchResults()
          ) : (
            <FlatList
              data={[]}
              ListHeaderComponent={
                <>
                  {renderRecentSearches()}
                  {renderPopularCategories()}
                </>
              }
              contentContainerStyle={styles.content}
            />
          )}
        </>
      )}
    </SafeAreaView>
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.text,
  },
  content: {
    paddingBottom: SIZES.padding * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  clearText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginLeft: 12,
  },
  noRecentText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  popularContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    margin: SIZES.padding,
    marginTop: 0,
    borderRadius: SIZES.radius,
  },
  popularTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  resultsContainer: {
    padding: SIZES.padding,
  },
  productCard: {
    marginBottom: SIZES.padding,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
    marginTop: SIZES.height * 0.1,
  },
  emptyTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: 8,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen; 