import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data for product details
  const product = {
    id: productId,
    name: 'Smartphone X',
    price: 999.99,
    images: [
     
    ],
    description: 'The latest smartphone with advanced features including a powerful processor, high-resolution camera, and long-lasting battery. Perfect for both personal and professional use.',
    category: 'Electronics',
    rating: 4.8,
    reviews: 128,
    stock: 15,
    specifications: {
      'Processor': 'Snapdragon 8 Gen 2',
      'RAM': '8GB',
      'Storage': '256GB',
      'Display': '6.7" AMOLED',
      'Battery': '4500mAh',
      'Camera': '48MP + 12MP + 12MP',
    },
    features: [
      '5G Connectivity',
      'Wireless Charging',
      'Face ID',
      'Water Resistant',
      'Dual SIM',
    ],
    shop: {
      id: '1',
      name: 'Tech Store',
      rating: 4.5,
    },
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      Alert.alert('Error', 'Selected quantity exceeds available stock');
      return;
    }

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    }));

    Alert.alert(
      'Success',
      'Product added to cart',
      [
        {
          text: 'Continue Shopping',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        },
      ]
    );
  };

  const renderImageGallery = () => (
    <View style={styles.galleryContainer}>
      <Image
        source={product.images[selectedImage]}
        style={styles.mainImage}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailContainer}
      >
        {product.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.thumbnail,
              selectedImage === index && styles.selectedThumbnail,
            ]}
            onPress={() => setSelectedImage(index)}
          >
            <Image source={image} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Specifications</Text>
      {Object.entries(product.specifications).map(([key, value]) => (
        <View key={key} style={styles.specificationRow}>
          <Text style={styles.specificationLabel}>{key}</Text>
          <Text style={styles.specificationValue}>{value}</Text>
        </View>
      ))}
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Features</Text>
      {product.features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Text style={styles.featureText}>• {feature}</Text>
        </View>
      ))}
    </View>
  );

  const renderQuantityModal = () => (
    <Modal
      visible={showQuantityModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Quantity</Text>
            <TouchableOpacity onPress={() => setShowQuantityModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(text) => setQuantity(parseInt(text) || 1)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowQuantityModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                setShowQuantityModal(false);
                handleAddToCart();
              }}
            >
              <Text style={styles.confirmButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderImageGallery()}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>

          <View style={styles.stockContainer}>
            <Text style={[
              styles.stockText,
              { color: product.stock > 0 ? COLORS.success : COLORS.error }
            ]}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
            <Text style={styles.stockCount}>{product.stock} available</Text>
          </View>

          <TouchableOpacity
            style={styles.shopContainer}
            onPress={() => navigation.navigate('ShopDetails', { shopId: product.shop.id })}
          >
            <Text style={styles.shopName}>{product.shop.name}</Text>
            <Text style={styles.shopRating}>⭐ {product.shop.rating}</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {renderSpecifications()}
          {renderFeatures()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setShowQuantityModal(true)}
        >
          <Text style={styles.quantityButtonText}>Qty: {quantity}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addToCartButton, product.stock === 0 && styles.disabledButton]}
          onPress={() => setShowQuantityModal(true)}
          disabled={product.stock === 0}
        >
          <Text style={styles.addToCartButtonText}>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderQuantityModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  galleryContainer: {
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SIZES.small,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: SIZES.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius,
  },
  content: {
    padding: SIZES.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  name: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
  },
  price: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SIZES.large,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  rating: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
    marginRight: SIZES.small,
  },
  reviews: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  stockText: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    marginRight: SIZES.small,
  },
  stockCount: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  shopName: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
    flex: 1,
  },
  shopRating: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  description: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  specificationLabel: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  specificationValue: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  featureText: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  quantityButton: {
    padding: SIZES.medium,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    marginRight: SIZES.large,
  },
  quantityButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  addToCartButton: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  addToCartButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
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
    padding: SIZES.large,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    textAlign: 'center',
    marginHorizontal: SIZES.medium,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.small,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  confirmButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen; 