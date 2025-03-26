import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  CartItem, 
  Button, 
  Divider, 
  Empty, 
  Loader 
} from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import { 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../../services/cartService';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const result = await updateCartItem(productId, quantity);
      if (result.success) {
        setCart(result.cart);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const result = await removeFromCart(productId);
      if (result.success) {
        setCart(result.cart);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      Alert.alert('Error', 'Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await clearCart();
              if (result.success) {
                setCart({ items: [], total: 0 });
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <CartItem
      item={item}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemoveItem}
    />
  );

  const renderEmptyCart = () => (
    <Empty
      title="Your Cart is Empty"
      message="Add items to your cart to see them here."
      buttonText="Browse Products"
      onButtonPress={() => navigation.navigate('Home')}
      icon={<Feather name="shopping-cart" size={60} color={Colors.TEXT.SECONDARY} />}
    />
  );

  if (loading) {
    return <Loader fullscreen text="Loading cart..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Shopping Cart"
        leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={
          cart.items.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart}>
              <Feather name="trash-2" size={24} color={Colors.ERROR} />
            </TouchableOpacity>
          ) : null
        }
      />
      
      {cart.items.length > 0 ? (
        <>
          <FlatList
            data={cart.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.product._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.footer}>
            <Divider marginVertical={SPACING.SMALL} />
            
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>${cart.total.toFixed(2)}</Text>
            </View>
            
            <Text style={styles.taxNote}>Taxes and shipping calculated at checkout</Text>
            
            <Button
              title="Proceed to Checkout"
              onPress={() => navigation.navigate('Checkout')}
              style={styles.checkoutButton}
            />
          </View>
        </>
      ) : (
        renderEmptyCart()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  listContent: {
    padding: SPACING.MEDIUM,
    flexGrow: 1,
  },
  footer: {
    padding: SPACING.MEDIUM,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER.LIGHT,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.SMALL,
  },
  totalLabel: {
    ...Typography.TYPOGRAPHY.H5,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  totalAmount: {
    ...Typography.TYPOGRAPHY.H5,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  taxNote: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    marginBottom: SPACING.MEDIUM,
  },
  checkoutButton: {
    marginTop: SPACING.SMALL,
  },
});

export default CartScreen; 