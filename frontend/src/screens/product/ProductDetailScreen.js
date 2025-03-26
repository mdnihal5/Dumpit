import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  Button, 
  QuantitySelector, 
  Divider, 
  ProductCard, 
  Badge, 
  Loader, 
  Section 
} from '../../components';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../../styles';
import productService from '../../services/productService';
import { addToCart } from '../../services/cartService';
import { DEFAULT_PRODUCT_IMAGE } from '../../config';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.8;

const ProductDetailScreen = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      loadProductData();
    }
  }, [productId]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      const productResponse = await productService.getProductById(productId);
      if (productResponse.success) {
        setProduct(productResponse.product);
        
        // Load related products
        const relatedResponse = await productService.getRelatedProducts(productId);
        if (relatedResponse.success) {
          setRelatedProducts(relatedResponse.products);
        }
      } else {
        Alert.alert('Error', productResponse.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const result = await addToCart(product, quantity);
      if (result.success) {
        Alert.alert(
          'Added to Cart', 
          `${product.name} has been added to your cart.`,
          [
            { text: 'Continue Shopping', style: 'cancel' },
            { 
              text: 'View Cart', 
              onPress: () => navigation.navigate('Cart') 
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  const renderImagePagination = () => {
    if (!product || !product.images || product.images.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {product.images.map((_, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.paginationDot,
              index === imageIndex && styles.paginationDotActive
            ]}
            onPress={() => setImageIndex(index)}
          />
        ))}
      </View>
    );
  };

  const renderRelatedProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => {
        // Reset state and navigate to the same screen with new product ID
        setProduct(null);
        setRelatedProducts([]);
        setQuantity(1);
        setLoading(true);
        setImageIndex(0);
        navigation.push('ProductDetail', { productId: item._id });
      }}
      style={styles.relatedProductCard}
    />
  );

  if (loading) {
    return <Loader fullscreen text="Loading product details..." />;
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Product Not Found"
          leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This product could not be found.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const { 
    name, 
    price, 
    discountPrice, 
    description,
    features,
    stock,
    images,
    vendor,
    rating,
    ratingCount,
    category
  } = product;

  const imageUrl = images && images.length > 0 ? 
    images[imageIndex] : DEFAULT_PRODUCT_IMAGE;
  
  // Calculate discount percentage if discount price is available
  const discountPercentage = discountPrice && price ? 
    Math.round((1 - discountPrice / price) * 100) : null;
  
  const actualPrice = discountPrice || price;
  const isOutOfStock = stock === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Product Details"
        leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={Colors.TEXT.PRIMARY} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
          {discountPercentage && (
            <Badge
              label={`${discountPercentage}% OFF`}
              type="error"
              style={styles.discountBadge}
            />
          )}
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
          {renderImagePagination()}
        </View>
        
        <View style={styles.contentContainer}>
          {/* Product Info */}
          <View style={styles.productInfoContainer}>
            {/* Category */}
            {category && (
              <Text style={styles.category}>{category.name}</Text>
            )}
            
            {/* Product Name */}
            <Text style={styles.productName}>{name}</Text>
            
            {/* Vendor */}
            {vendor && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('VendorDetail', { vendorId: vendor._id })}
                style={styles.vendorContainer}
              >
                <Text style={styles.vendorLabel}>Sold by: </Text>
                <Text style={styles.vendorName}>{vendor.name}</Text>
              </TouchableOpacity>
            )}
            
            {/* Rating */}
            {rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
                {ratingCount > 0 && (
                  <TouchableOpacity onPress={() => navigation.navigate('Reviews', { productId })}>
                    <Text style={styles.reviewsLink}>
                      ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Price */}
            <View style={styles.priceContainer}>
              {discountPrice ? (
                <>
                  <Text style={styles.discountPrice}>${discountPrice.toFixed(2)}</Text>
                  <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.price}>${price.toFixed(2)}</Text>
              )}
            </View>
            
            {/* Stock */}
            <Text style={styles.stockText}>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${stock} available)`}
            </Text>
            
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <QuantitySelector
                  quantity={quantity}
                  onChangeQuantity={setQuantity}
                  max={stock}
                />
              </View>
            )}
            
            {/* Add to Cart Button */}
            <Button
              title="Add to Cart"
              onPress={handleAddToCart}
              disabled={isOutOfStock}
              style={styles.addToCartButton}
            />
          </View>
          
          <Divider marginVertical={SPACING.MEDIUM} />
          
          {/* Description */}
          <Section title="Description">
            <Text style={styles.description}>{description}</Text>
          </Section>
          
          {/* Features */}
          {features && features.length > 0 && (
            <Section title="Features">
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Feather name="check" size={16} color={Colors.SUCCESS} style={styles.featureIcon} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </Section>
          )}
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Section 
              title="Related Products" 
              rightText="See All"
              onRightPress={() => navigation.navigate('Products', { category: category?._id })}
            >
              <FlatList
                data={relatedProducts}
                renderItem={renderRelatedProduct}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedProductsList}
              />
            </Section>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: Colors.BACKGROUND.SECONDARY,
  },
  productImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING.MEDIUM,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.TEXT.TERTIARY,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.MEDIUM,
    right: SPACING.MEDIUM,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...Typography.TYPOGRAPHY.H4,
    color: Colors.TEXT.INVERSE,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  contentContainer: {
    padding: SPACING.MEDIUM,
  },
  productInfoContainer: {
    marginBottom: SPACING.LARGE,
  },
  category: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    textTransform: 'uppercase',
    marginBottom: SPACING.XSMALL,
  },
  productName: {
    ...Typography.TYPOGRAPHY.H3,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginBottom: SPACING.SMALL,
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  vendorLabel: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
  },
  vendorName: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  rating: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.WARNING,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginRight: SPACING.XSMALL,
  },
  reviewsLink: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.PRIMARY,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  price: {
    ...Typography.TYPOGRAPHY.H4,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  discountPrice: {
    ...Typography.TYPOGRAPHY.H4,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginRight: SPACING.SMALL,
  },
  originalPrice: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    textDecorationLine: 'line-through',
  },
  stockText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    marginBottom: SPACING.MEDIUM,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  quantityLabel: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    marginRight: SPACING.MEDIUM,
  },
  addToCartButton: {
    marginTop: SPACING.SMALL,
  },
  description: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SMALL,
  },
  featureIcon: {
    marginRight: SPACING.SMALL,
    marginTop: 3,
  },
  featureText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    flex: 1,
  },
  relatedProductsList: {
    paddingTop: SPACING.SMALL,
    paddingRight: SPACING.MEDIUM,
  },
  relatedProductCard: {
    marginRight: SPACING.MEDIUM,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  errorText: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LARGE,
  },
  errorButton: {
    minWidth: 150,
  },
});

export default ProductDetailScreen; 