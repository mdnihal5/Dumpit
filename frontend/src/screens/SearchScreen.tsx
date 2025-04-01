import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../utils/theme';
import Header from '../components/Header';
import { productService } from '../services/api';

type Props = NativeStackScreenProps<MainStackParamList, 'Search'>;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await productService.searchProducts(searchQuery);
      
      if (response.data && response.data.success) {
        setSearchResults(response.data.data.products || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToProduct = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const renderSearchItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigateToProduct(item._id)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={colors.darkGray} />
    </TouchableOpacity>
  );

  const renderEmptyResults = () => (
    <View style={styles.emptyContainer}>
      <Feather name="search" size={60} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptyText}>
        We couldn't find any products matching your search.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search Products" showBack={true} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={colors.darkGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Feather name="x" size={20} color={colors.darkGray} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {hasSearched && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {searchResults.length === 0
                  ? 'No results found'
                  : `${searchResults.length} result${
                      searchResults.length !== 1 ? 's' : ''
                    } found`}
              </Text>
            </View>
          )}
          
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={renderSearchItem}
            ListEmptyComponent={hasSearched ? renderEmptyResults : null}
            contentContainerStyle={
              searchResults.length === 0 ? { flex: 1 } : styles.resultsList
            }
          />
        </>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    ...shadows.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: spacing.sm,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  clearButton: {
    padding: spacing.xs,
  },
  searchButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    ...shadows.xs,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  resultsText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
  },
  resultsList: {
    padding: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  productCategory: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.darkGray,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
    textAlign: 'center',
  },
});

export default SearchScreen; 