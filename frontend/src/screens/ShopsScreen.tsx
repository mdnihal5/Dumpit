import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { vendorService } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../utils/theme';
import commonStyles from '../utils/commonStyles';
import { MainScreenNavigationProp } from '../types/navigation';

interface Vendor {
  _id: string;
  businessName: string;
  businessDescription: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  categories: string[];
  activeProductsCount: number;
  totalOrders: number;
  deliveryRadius: number;
}

const ShopsScreen: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      filterVendors();
    }
  }, [searchQuery, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getAllVendors();
      if (response.data.success) {
        setVendors(response.data.data.vendors);
        setFilteredVendors(response.data.data.vendors);
        setVendors(MOCK_VENDORS);
        setFilteredVendors(MOCK_VENDORS);
      } else {
        // Use mock data if API returns unsuccessful response
        
        setVendors(MOCK_VENDORS);
        setFilteredVendors(MOCK_VENDORS);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Fallback to mock data on error
      setVendors(MOCK_VENDORS);
      setFilteredVendors(MOCK_VENDORS);
      Alert.alert('Error', 'Failed to load shops. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterVendors = () => {
    if (!searchQuery.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const filtered = vendors.filter(
      vendor =>
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.businessDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.categories.some(category =>
          category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredVendors(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const handleShopPress = (vendorId: string) => {
    navigation.navigate('Shop', { shopId: vendorId });
  };

  const renderVendorItem = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleShopPress(item._id)}
    >
      <Image
        source={{ uri: item.logo || 'https://via.placeholder.com/80' }}
        style={styles.vendorLogo}
      />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.businessName}</Text>
        <Text style={styles.vendorDescription} numberOfLines={2}>
          {item.businessDescription}
        </Text>
        
        <View style={styles.vendorStats}>
          <View style={styles.statItem}>
            <Feather name="package" size={14} color={colors.primary} />
            <Text style={styles.statText}>{item.activeProductsCount} Products</Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="truck" size={14} color={colors.primary} />
            <Text style={styles.statText}>{item.deliveryRadius}km Radius</Text>
          </View>
        </View>
        
        <View style={styles.categoryContainer}>
          {item.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
          {item.categories.length > 3 && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>+{item.categories.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={commonStyles.emptyContainer}>
      <Feather name="shopping-bag" size={64} color={colors.mediumGray} />
      <Text style={commonStyles.emptyTitle}>No Shops Found</Text>
      <Text style={commonStyles.emptyText}>
        {searchQuery
          ? `No shops match "${searchQuery}". Try a different search term.`
          : 'There are no shops available at the moment. Please check back later.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="Browse Shops" />
      
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.darkGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops by name or category..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>
      
      {loading && !refreshing ? (
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Loading shops...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVendors}
          renderItem={renderVendorItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

// Mock data for fallback
const MOCK_VENDORS: Vendor[] = [
  {
    _id: '1',
    businessName: 'BuildMate Supplies',
    businessDescription: 'Quality building materials and hardware supplies for contractors and DIY enthusiasts.',
    logo: 'https://via.placeholder.com/80',
    contactEmail: 'info@buildmate.com',
    contactPhone: '+91 9876543210',
    categories: ['cement', 'bricks', 'hardware'],
    activeProductsCount: 120,
    totalOrders: 450,
    deliveryRadius: 15,
  },
  {
    _id: '2',
    businessName: 'Steel World',
    businessDescription: 'Specialists in all types of construction steel and metal products.',
    logo: 'https://via.placeholder.com/80',
    contactEmail: 'contact@steelworld.com',
    contactPhone: '+91 8765432109',
    categories: ['steel', 'hardware'],
    activeProductsCount: 85,
    totalOrders: 320,
    deliveryRadius: 10,
  },
  {
    _id: '3',
    businessName: 'Paints & More',
    businessDescription: 'Complete range of paints, coatings, and painting accessories for residential and commercial projects.',
    logo: 'https://via.placeholder.com/80',
    contactEmail: 'hello@paintsandmore.com',
    contactPhone: '+91 7654321098',
    categories: ['paint', 'hardware', 'tools'],
    activeProductsCount: 150,
    totalOrders: 580,
    deliveryRadius: 20,
  },
];

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.body1.fontSize,
    color: colors.text,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vendorLogo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: typography.h4.fontSize,
    fontWeight: '600' as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  vendorDescription: {
    fontSize: typography.body2.fontSize,
    color: colors.darkGray,
    marginBottom: spacing.sm,
  },
  vendorStats: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    color: colors.text,
  },
});

export default ShopsScreen; 