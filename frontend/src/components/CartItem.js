import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../styles';
import { DEFAULT_PRODUCT_IMAGE } from '../config';

const CartItem = ({
  item,
  onRemove,
  onUpdateQuantity,
  style,
  ...props
}) => {
  if (!item || !item.product) return null;
  
  const { 
    product, 
    quantity
  } = item;
  
  const {
    name,
    price,
    discountPrice,
    images,
    vendor
  } = product;
  
  // Get actual price (considering discounts)
  const actualPrice = discountPrice || price;
  const totalPrice = actualPrice * quantity;
  
  // Get the first image or use default
  const imageUrl = images && images.length > 0 ? images[0] : DEFAULT_PRODUCT_IMAGE;
  
  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product._id, quantity - 1);
    } else {
      onRemove(product._id);
    }
  };
  
  const handleIncrement = () => {
    onUpdateQuantity(product._id, quantity + 1);
  };
  
  return (
    <View style={[styles.container, style]} {...props}>
      {/* Product Image */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          {/* Product Name */}
          <Text style={styles.productName} numberOfLines={1}>
            {name}
          </Text>
          
          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => onRemove(product._id)}
            style={styles.removeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        {/* Vendor Name if available */}
        {vendor && vendor.name && (
          <Text style={styles.vendorName} numberOfLines={1}>
            {vendor.name}
          </Text>
        )}
        
        <View style={styles.bottomRow}>
          {/* Price */}
          <Text style={styles.price}>
            ${totalPrice.toFixed(2)}
          </Text>
          
          {/* Quantity Controls */}
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={handleDecrement}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <TouchableOpacity 
              onPress={handleIncrement}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.SMALL,
    marginBottom: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: Colors.BORDER.LIGHT,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.SMALL,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.SMALL,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    ...Typography.TYPOGRAPHY.BODY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    color: Colors.TEXT.PRIMARY,
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  removeButton: {
    padding: SPACING.TINY,
  },
  removeText: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  vendorName: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    marginVertical: SPACING.TINY,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.SMALL,
  },
  price: {
    ...Typography.TYPOGRAPHY.BODY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    color: Colors.TEXT.PRIMARY,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    ...Typography.TYPOGRAPHY.BUTTON_SMALL,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  quantity: {
    ...Typography.TYPOGRAPHY.BODY,
    marginHorizontal: SPACING.SMALL,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default CartItem; 