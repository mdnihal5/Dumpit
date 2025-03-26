import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, Header, CartItem } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../redux/slices/orderSlice';

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: 'cash-outline',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'card-outline',
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: 'phone-portrait-outline',
  },
];

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: cartItems, total: cartTotal } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [tax, setTax] = useState(cartTotal * 0.18); // 18% GST
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    // Calculate total
    setTax(cartTotal * 0.18);
    setTotal(cartTotal + deliveryFee + (cartTotal * 0.18));
    
    // Set default address
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [cartTotal, deliveryFee, user]);
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: selectedAddress._id,
        paymentMethod: selectedPaymentMethod,
        subtotal: cartTotal,
        tax: tax,
        deliveryFee: deliveryFee,
        total: total,
      };
      
      const result = await dispatch(createOrder(orderData)).unwrap();
      
      // If payment method is cash, go to success screen
      if (selectedPaymentMethod === 'cash') {
        navigation.navigate('OrderSuccess', { order: result });
      } else {
        // For card/UPI, go to payment screen
        navigation.navigate('Payment', { 
          order: result,
          amount: total,
          paymentMethod: selectedPaymentMethod
        });
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to place order. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Checkout" onBack={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddressList', { 
                selectMode: true,
                onSelect: (address) => setSelectedAddress(address) 
              })}
            >
              <Text style={styles.actionText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>{selectedAddress.name}</Text>
              <Text style={styles.addressText}>{selectedAddress.formattedAddress}</Text>
              <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={() => navigation.navigate('AddressList', { 
                selectMode: true,
                onSelect: (address) => setSelectedAddress(address)
              })}
            >
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              <Text style={styles.addAddressText}>Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              readonly={true}
            />
          ))}
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (18% GST)</Text>
              <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <Ionicons 
                name={method.icon} 
                size={24} 
                color={selectedPaymentMethod === method.id ? COLORS.primary : COLORS.text} 
              />
              <Text 
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethodText
                ]}
              >
                {method.name}
              </Text>
              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>₹{total.toFixed(2)}</Text>
        </View>
        
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={loading}
          style={styles.placeOrderButton}
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
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 8,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
  },
  actionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  addressPhone: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    borderStyle: 'dashed',
  },
  addAddressText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryContainer: {
    marginTop: 16,
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
    borderColor: COLORS.border,
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
  },
  totalValue: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginTop: 12,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  paymentMethodText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    marginLeft: 12,
  },
  selectedPaymentMethodText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  priceValue: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    width: '60%',
  },
});

export default CheckoutScreen; 