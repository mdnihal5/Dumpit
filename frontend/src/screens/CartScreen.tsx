import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextStyle, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, typography, spacing } from '../utils/theme';
import commonStyles from '../utils/commonStyles';
import { cartService } from '../api/services';

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Cart'>,
  BottomTabScreenProps<MainTabParamList, 'Cart'>
>;

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  total: number;
}

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      
      if (response.data.success && response.data.data) {
        setCart(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load your cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await handleRemoveItem(itemId);
        return;
      }
      
      setLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      
      if (response.data.success && response.data.data) {
        setCart(response.data.data);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update item quantity');
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setLoading(true);
      const response = await cartService.removeCartItem(itemId);
      
      if (response.data.success) {
        if (response.data.data) {
          setCart(response.data.data);
        } else {
          setCart(null); // Cart might be empty after removal
        }
      } else {
        Alert.alert('Error', response.data.message || 'Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
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
              setLoading(true);
              const response = await cartService.clearCart();
              
              if (response.data.success) {
                setCart(null);
              } else {
                Alert.alert('Error', response.data.message || 'Failed to clear cart');
              }
            } catch (err) {
              console.error('Error clearing cart:', err);
              Alert.alert('Error', 'Something went wrong. Please try again later.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    
    // Navigate to checkout screen
    navigation.navigate('Checkout');
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="My Cart" showBack={false} />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="My Cart" showBack={false} />
        <View style={styles.container}>
          <View style={styles.emptyCart}>
            <Feather name="shopping-cart" size={64} color={colors.mediumGray} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Browse our products and add items to your cart
            </Text>
            <Button 
              title="Shop Now" 
              onPress={() => navigation.navigate('Shops')} 
              style={styles.shopButton}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Cart with items
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header 
        title="My Cart" 
        showBack={false} 
        rightIcon={
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.container}>
        <FlatList
          data={cart.items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image 
                source={{ uri: item.product.images[0] || 'https://via.placeholder.com/80' }} 
                style={styles.productImage} 
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.productPrice}>${item.product.price.toFixed(2)}</Text>
                
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    onPress={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Feather name="minus" size={16} color={colors.text} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  
                  <TouchableOpacity 
                    onPress={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Feather name="plus" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={() => handleRemoveItem(item._id)}
                style={styles.removeButton}
              >
                <Feather name="trash-2" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
        
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${cart.total.toFixed(2)}</Text>
          </View>
          
          <Button 
            title="Proceed to Checkout" 
            onPress={handleCheckout} 
            style={styles.checkoutButton} 
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    fontWeight: 'normal' as TextStyle['fontWeight'],
    lineHeight: typography.body1.lineHeight,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shopButton: {
    minWidth: 150,
  },
  clearButton: {
    padding: spacing.sm,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: typography.body2.fontSize,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  cartItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: typography.body1.fontSize,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    paddingHorizontal: spacing.md,
    fontSize: typography.body2.fontSize,
  },
  removeButton: {
    padding: spacing.xs,
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.h3.fontSize,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.text,
  },
  totalAmount: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
});

export default CartScreen; 