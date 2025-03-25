import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import QuantitySelector from '../../components/products/QuantitySelector';
import CartItem from '../../components/cart/CartItem';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.product.stock) {
      Alert.alert(
        'Stock Limit',
        `Only ${item.product.stock} units available in stock.`
      );
      return;
    }
    dispatch(updateCartItemQuantity({ item, quantity: newQuantity }));
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => dispatch(removeFromCart(item)),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-outline" size={SIZES.extraLarge} color={COLORS.text.light} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Button
          title="Continue Shopping"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <CartItem
            key={item.product._id}
            item={item}
            onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
            onRemove={() => handleRemoveItem(item)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (18%)</Text>
            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollView: {
    padding: SPACING.medium,
  },
  footer: {
    padding: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
  },
  summary: {
    marginBottom: SPACING.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  summaryLabel: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: FONTS.size.medium,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
  },
  totalLabel: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: FONTS.size.medium,
  },
  checkoutButton: {
    marginTop: SPACING.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  shopButton: {
    backgroundColor: COLORS.button.primary,
  },
});

export default CartScreen; 