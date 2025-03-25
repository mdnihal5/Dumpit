import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, BORDER_RADIUS, SPACING, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - SPACING.lg * 2;

const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
  style,
}) => {
  const {
    productId,
    name,
    price,
    images,
    quantity,
    vendor,
  } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(productId, newQuantity);
    }
  };

  return (
    <View style={[styles.container, SHADOWS.light, style]}>
      <Image
        source={{ uri: images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(productId)}
            style={styles.removeButton}
          >
            <Icon name="close" size={SIZES.medium} color={COLORS.text.light} />
          </TouchableOpacity>
        </View>
        <Text style={styles.vendor} numberOfLines={1}>
          {vendor.name}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(quantity - 1)}
              style={styles.quantityButton}
            >
              <Icon name="minus" size={SIZES.medium} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(quantity + 1)}
              style={styles.quantityButton}
            >
              <Icon name="plus" size={SIZES.medium} color={COLORS.primary} />
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
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.md,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.medium,
  },
  content: {
    flex: 1,
    paddingLeft: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  vendor: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.xs,
  },
  quantityButton: {
    padding: SPACING.xs,
  },
  quantity: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginHorizontal: SPACING.sm,
  },
});

export default CartItem; 