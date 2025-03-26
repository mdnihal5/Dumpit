import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, CartItem, Button } from '../../components';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../../redux/slices/cartSlice';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading, error, subtotal, totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fixed delivery fee and tax calculation (can be made dynamic)
  const deliveryFee = 50;
  const taxRate = 0.1; // 10%
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  const loadCart = async () => {
    try {
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCart();
    setIsRefreshing(false);
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        handleRemoveItem(productId);
        return;
      }
      
      await dispatch(updateCartItem({ productId, quantity })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      Alert.alert('Error', 'Could not update quantity. Please try again.');
    }
  };

  const handleRemoveItem = (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeFromCart({ productId })).unwrap();
            } catch (error) {
              console.error('Failed to remove item:', error);
              Alert.alert('Error', 'Could not remove item. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(clearCart()).unwrap();
            } catch (error) {
              console.error('Failed to clear cart:', error);
              Alert.alert('Error', 'Could not clear cart. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to proceed to checkout',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items to proceed.');
      return;
    }
    
    navigation.navigate('Checkout');
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Browse our products and add items to your cart</Text>
      <Button
        title="Browse Products"
        onPress={() => navigation.navigate('Home')}
        style={styles.browseButton}
      />
    </View>
  );

  const renderCartFooter = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (10%)</Text>
        <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
      
      <Button
        title="Proceed to Checkout"
        onPress={handleCheckout}
        style={styles.checkoutButton}
      />
      
      <TouchableOpacity style={styles.continueShoppingButton} onPress={() => navigation.goBack()}>
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Your Cart"
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Your Cart"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        }
        rightComponent={
          items.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={(quantity) => handleUpdateQuantity(item.product.id, quantity)}
            onRemove={() => handleRemoveItem(item.product.id)}
          />
        )}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyCart}
        ListFooterComponent={items.length > 0 ? renderCartFooter : null}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: SIZES.padding * 2,
    flexGrow: 1,
  },
  clearText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginTop: SIZES.height * 0.1,
  },
  emptyTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginTop: SIZES.padding,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SIZES.padding,
  },
  browseButton: {
    marginTop: SIZES.padding,
    width: '80%',
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    margin: SIZES.padding,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  totalValue: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
  },
  checkoutButton: {
    marginTop: SIZES.padding,
  },
  continueShoppingButton: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  continueShoppingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
});

export default CartScreen; 