import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Share,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, Header } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const { width } = Dimensions.get('window');

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    user: { name: 'John Doe' },
    rating: 4,
    comment: 'Great quality product. Delivery was fast.',
    createdAt: '2023-06-10T10:00:00Z',
  },
  {
    id: '2',
    user: { name: 'Jane Smith' },
    rating: 5,
    comment: 'Excellent product, highly recommended!',
    createdAt: '2023-06-05T14:30:00Z',
  },
  {
    id: '3',
    user: { name: 'Mike Johnson' },
    rating: 3,
    comment: 'Product is good, but a bit expensive.',
    createdAt: '2023-05-28T09:15:00Z',
  },
];

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { items: cartItems } = useSelector(state => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Check if product is already in cart
  const isInCart = cartItems.some(item => item.id === product._id);
  const cartItem = cartItems.find(item => item.id === product._id);
  
  // If no images available, use a placeholder
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: 'https://via.placeholder.com/500x500?text=No+Image' }];
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.name} on DumpIt App!`,
        url: product.images?.[0]?.url,
      });
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Scroll to the tab content
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: width, animated: true });
    }
  };
  
  const renderRating = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? COLORS.warning : COLORS.textTertiary}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <Header
        title={product.name}
        onBack={() => navigation.goBack()}
        rightIcon={<Ionicons name="share-outline" size={24} color={COLORS.text} />}
        onRightPress={handleShare}
      />
      
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Product Images Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item.url }} 
                style={styles.productImage}
                resizeMode="contain"
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            keyExtractor={(item, index) => `image-${index}`}
          />
          
          {/* Image Pagination Dots */}
          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.paginationDot,
                    index === activeImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{product.pricePerUnit.toFixed(2)} 
              <Text style={styles.unit}>/{product.baseUnit}</Text>
            </Text>
            
            {product.discount && product.discount.percentage > 0 && (
              <>
                <Text style={styles.originalPrice}>
                  ₹{((product.pricePerUnit * 100) / (100 - product.discount.percentage)).toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.discount.percentage}% OFF</Text>
                </View>
              </>
            )}
          </View>
          
          {/* Vendor */}
          <TouchableOpacity 
            style={styles.vendorContainer}
            onPress={() => navigation.navigate('VendorDetails', { vendor: product.vendor })}
          >
            <Image 
              source={{ 
                uri: product.vendor?.logo || 'https://via.placeholder.com/50' 
              }} 
              style={styles.vendorLogo}
            />
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>
                {product.vendor?.businessName || 'Unknown Vendor'}
              </Text>
              <Text style={styles.vendorRating}>
                <Ionicons name="star" size={14} color={COLORS.warning} /> 
                {product.vendor?.averageRating?.toFixed(1) || '0.0'} Rating
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'description' && styles.activeTab
              ]}
              onPress={() => handleTabChange('description')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'description' && styles.activeTabText
                ]}
              >
                Description
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'specifications' && styles.activeTab
              ]}
              onPress={() => handleTabChange('specifications')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'specifications' && styles.activeTabText
                ]}
              >
                Specifications
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'reviews' && styles.activeTab
              ]}
              onPress={() => handleTabChange('reviews')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'reviews' && styles.activeTabText
                ]}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' && (
              <Text style={styles.description}>
                {product.description || 'No description available for this product.'}
              </Text>
            )}
            
            {activeTab === 'specifications' && (
              <View style={styles.specificationsContainer}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Brand</Text>
                  <Text style={styles.specValue}>{product.brand || 'N/A'}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Base Unit</Text>
                  <Text style={styles.specValue}>{product.baseUnit}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Min Order Quantity</Text>
                  <Text style={styles.specValue}>{product.minOrderQuantity || 1}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Stock</Text>
                  <Text style={styles.specValue}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tax</Text>
                  <Text style={styles.specValue}>{product.taxPercentage || 0}%</Text>
                </View>
              </View>
            )}
            
            {activeTab === 'reviews' && (
              <View style={styles.reviewsContainer}>
                {mockReviews.length > 0 ? (
                  <>
                    {mockReviews.map((review) => (
                      <View key={review.id} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewerName}>{review.user.name}</Text>
                          <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                        </View>
                        {renderRating(review.rating)}
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                      </View>
                    ))}
                    <TouchableOpacity 
                      style={styles.allReviewsButton}
                      onPress={() => navigation.navigate('AllReviews', { productId: product._id })}
                    >
                      <Text style={styles.allReviewsText}>See All Reviews</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.noReviewsText}>No reviews yet.</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={decrementQuantity}
          >
            <Ionicons name="remove" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={incrementQuantity}
          >
            <Ionicons name="add" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <Button
          title={isInCart ? "Update Cart" : "Add to Cart"}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width * 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: 100, // Extra padding for bottom bar
  },
  productName: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  unit: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },
  originalPrice: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  vendorInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  vendorName: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  vendorRating: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  tabContent: {
    paddingVertical: 16,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 24,
  },
  specificationsContainer: {
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  specLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  specValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  reviewsContainer: {
    marginBottom: 16,
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  reviewDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewComment: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  allReviewsButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  allReviewsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
  noReviewsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
    width: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
  },
});

export default ProductDetailsScreen; 