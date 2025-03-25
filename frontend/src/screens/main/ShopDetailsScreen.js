import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const ShopDetailsScreen = ({ route, navigation }) => {
  const { shopId } = route.params;
  const [selectedTab, setSelectedTab] = useState('products');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock data for shop details
  const shopDetails = {
    id: shopId,
    name: 'Tech Store',
    image: null,
    coverImage: null,
    rating: 4.5,
    category: 'Electronics',
    productCount: 150,
    description: 'Your one-stop shop for all things tech. We offer a wide range of electronic products including smartphones, laptops, accessories, and more.',
    isOpen: true,
    openingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    contact: {
      phone: '+1 234 567 8900',
      email: 'contact@techstore.com',
      address: '123 Tech Street, Digital City, DC 12345',
    },
  };

  // Mock data for products
  const products = [
    {
      id: '1',
      name: 'Smartphone X',
      price: 999.99,
      image:null,
      description: 'Latest smartphone with advanced features',
      category: 'Electronics',
      rating: 4.8,
      stock: 15,
    },
    {
      id: '2',
      name: 'Laptop Pro',
      price: 1299.99,
      image: null,
      description: 'High-performance laptop for professionals',
      category: 'Electronics',
      rating: 4.6,
      stock: 8,
    },
    // Add more mock products as needed
  ];

  useEffect(() => {
    setFilteredProducts(products);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Image source={shopDetails.coverImage} style={styles.coverImage} />
      <View style={styles.headerContent}>
        <Image source={shopDetails.image} style={styles.shopImage} />
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{shopDetails.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {shopDetails.rating}</Text>
            <Text style={styles.productCount}>{shopDetails.productCount} products</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'products' && styles.selectedTab]}
        onPress={() => setSelectedTab('products')}
      >
        <Text style={[styles.tabText, selectedTab === 'products' && styles.selectedTabText]}>
          Products
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'about' && styles.selectedTab]}
        onPress={() => setSelectedTab('about')}
      >
        <Text style={[styles.tabText, selectedTab === 'about' && styles.selectedTabText]}>
          About
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'contact' && styles.selectedTab]}
        onPress={() => setSelectedTab('contact')}
      >
        <Text style={[styles.tabText, selectedTab === 'contact' && styles.selectedTabText]}>
          Contact
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.productsContainer}>
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          >
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productRating}>⭐ {item.rating}</Text>
                <Text style={styles.productStock}>In Stock: {item.stock}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.description}>{shopDetails.description}</Text>
      
      <Text style={styles.sectionTitle}>Opening Hours</Text>
      {Object.entries(shopDetails.openingHours).map(([day, hours]) => (
        <View key={day} style={styles.hoursRow}>
          <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
          <Text style={styles.hoursText}>{hours}</Text>
        </View>
      ))}
    </View>
  );

  const renderContact = () => (
    <View style={styles.contactContainer}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
      <TouchableOpacity style={styles.contactItem}>
        <Text style={styles.contactLabel}>Phone</Text>
        <Text style={styles.contactValue}>{shopDetails.contact.phone}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.contactItem}>
        <Text style={styles.contactLabel}>Email</Text>
        <Text style={styles.contactValue}>{shopDetails.contact.email}</Text>
      </TouchableOpacity>
      
      <View style={styles.contactItem}>
        <Text style={styles.contactLabel}>Address</Text>
        <Text style={styles.contactValue}>{shopDetails.contact.address}</Text>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add filter options here */}
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilterModal(false)}
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
      <ScrollView>
        {renderHeader()}
        {renderTabs()}
        
        {selectedTab === 'products' && renderProducts()}
        {selectedTab === 'about' && renderAbout()}
        {selectedTab === 'contact' && renderContact()}
      </ScrollView>
      
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SIZES.large,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  shopInfo: {
    marginLeft: SIZES.large,
    flex: 1,
  },
  shopName: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  rating: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    marginRight: SIZES.large,
  },
  productCount: {
    fontSize: FONTS.body2,
    color: COLORS.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.small,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    padding: SIZES.medium,
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
  selectedTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  selectedTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  productsContainer: {
    flex: 1,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  filterButton: {
    padding: SIZES.small,
  },
  filterButtonText: {
    fontSize: FONTS.large,
  },
  productsList: {
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
  productPrice: {
    fontSize: FONTS.body2,
    color: COLORS.primary,
    marginTop: SIZES.small,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  productRating: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  productStock: {
    fontSize: FONTS.body2,
    color: COLORS.success,
  },
  aboutContainer: {
    padding: SIZES.large,
    backgroundColor: COLORS.white,
  },
  description: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: SIZES.small,
    lineHeight: 24,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dayText: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  hoursText: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  contactContainer: {
    padding: SIZES.large,
    backgroundColor: COLORS.white,
  },
  contactItem: {
    marginTop: SIZES.large,
  },
  contactLabel: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small / 2,
  },
  contactValue: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
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

export default ShopDetailsScreen; 