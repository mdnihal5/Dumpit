import React, { useState, useEffect } from 'react';
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
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AddressCard from '../../components/checkout/AddressCard';
import PaymentMethodCard from '../../components/checkout/PaymentMethodCard';
import OrderSummary from '../../components/checkout/OrderSummary';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = 100;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items,
        address: selectedAddress,
        paymentMethod: selectedPayment,
        subtotal,
        tax,
        shipping,
        total,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
      };

      await dispatch(createOrder(orderData));
      dispatch(clearCart());
      navigation.navigate('OrderConfirmation');
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Addresses')}>
          <Text style={styles.addButton}>Add New</Text>
        </TouchableOpacity>
      </View>

      {user?.addresses?.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          selected={selectedAddress?._id === address._id}
          onSelect={() => setSelectedAddress(address)}
        />
      ))}
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethods}>
        <PaymentMethodCard
          type="card"
          selected={selectedPayment === 'card'}
          onSelect={() => setSelectedPayment('card')}
        />
        <PaymentMethodCard
          type="upi"
          selected={selectedPayment === 'upi'}
          onSelect={() => setSelectedPayment('upi')}
        />
        <PaymentMethodCard
          type="cod"
          selected={selectedPayment === 'cod'}
          onSelect={() => setSelectedPayment('cod')}
        />
      </View>
    </View>
  );

  const renderCustomerInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Customer Information</Text>
      <Input
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Enter your full name"
      />
      <Input
        label="Phone Number"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      <Input
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderCustomerInfo()}
        <OrderSummary
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={!selectedAddress || !selectedPayment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    padding: SPACING.large,
  },
  section: {
    marginBottom: SPACING.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
  },
  addButton: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    padding: SPACING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  totalLabel: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: FONTS.size.large,
  },
});

export default CheckoutScreen; 