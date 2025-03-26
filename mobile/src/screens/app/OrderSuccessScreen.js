import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useSelector(state => state.auth);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDeliveryDate = () => {
    const orderDate = new Date(order.createdAt || new Date());
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Assuming 3 days for delivery
    return formatDate(deliveryDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={50} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>
            Your order has been placed and is being processed
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Number</Text>
            <Text style={styles.orderInfoValue}>{order._id}</Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Date</Text>
            <Text style={styles.orderInfoValue}>{formatDate(order.createdAt || new Date())}</Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Expected Delivery</Text>
            <Text style={styles.orderInfoValue}>{getDeliveryDate()}</Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Payment Method</Text>
            <Text style={styles.orderInfoValue}>
              {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}
            </Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Delivery Address</Text>
            <Text style={styles.orderInfoValue}>
              {user?.addresses?.find(addr => addr._id === order.deliveryAddress)?.formattedAddress || 
              'Address information not available'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          {order.paymentInfo ? (
            <>
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Transaction ID</Text>
                <Text style={styles.orderInfoValue}>{order.paymentInfo.transactionId}</Text>
              </View>
              
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Payment Date</Text>
                <Text style={styles.orderInfoValue}>{formatDate(order.paymentInfo.paymentDate)}</Text>
              </View>
              
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Status</Text>
                <Text style={[styles.orderInfoValue, styles.successText]}>
                  Success
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.pendingText}>
              {order.paymentMethod === 'cash' ? 
                'Payment will be collected upon delivery' : 
                'Payment processing...'}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.subtotal?.toFixed(2) || '0.00'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{order.deliveryFee?.toFixed(2) || '0.00'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹{order.tax?.toFixed(2) || '0.00'}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Track Order"
          onPress={() => navigation.navigate('OrderTracking', { orderId: order._id })}
          style={styles.trackButton}
        />
        
        <Button
          title="Continue Shopping"
          onPress={() => navigation.navigate('Home')}
          variant="outline"
          style={styles.continueButton}
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
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100, // Extra padding for footer
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 16,
  },
  orderInfoRow: {
    marginBottom: 12,
  },
  orderInfoLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  orderInfoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 16,
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
  successText: {
    color: COLORS.success,
    fontWeight: '500',
  },
  pendingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  trackButton: {
    marginBottom: 12,
  },
  continueButton: {
  },
});

export default OrderSuccessScreen; 