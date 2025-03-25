import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // TODO: Implement API call to fetch order details
    // For now, using mock data
    setOrder({
      id: orderId,
      orderNumber: '#ORD-001',
      vendor: 'Tech Store',
      vendorPhone: '+1234567890',
      vendorEmail: 'techstore@example.com',
      vendorAddress: '123 Tech Street, City, Country',
      amount: 150,
      status: 'completed',
      date: '2024-03-25',
      items: [
        {
          id: '1',
          name: 'Product 1',
          quantity: 2,
          price: 75,
          image: 'https://example.com/product1.jpg',
        },
      ],
      customer: {
        name: 'John Doe',
        phone: '+1987654321',
        email: 'john@example.com',
        address: '456 Customer Street, City, Country',
      },
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Delivery',
      trackingNumber: 'TRK123456789',
      notes: 'Please deliver in the evening',
    });
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'processing':
        return COLORS.info;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.text.secondary;
    }
  };

  const handleCallVendor = () => {
    Linking.openURL(`tel:${order.vendorPhone}`);
  };

  const handleEmailVendor = () => {
    Linking.openURL(`mailto:${order.vendorEmail}`);
  };

  const handleTrackOrder = () => {
    // TODO: Implement order tracking
    Alert.alert('Tracking', 'Order tracking will be implemented soon.');
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <Text style={[
          styles.orderStatus,
          { color: getStatusColor(order.status) }
        ]}>
          {order.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${order.amount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendor Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.vendorName}>{order.vendor}</Text>
          <Text style={styles.infoText}>{order.vendorAddress}</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[styles.contactButton, styles.callButton]}
              onPress={handleCallVendor}
            >
              <Text style={styles.contactButtonText}>Call Vendor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, styles.emailButton]}
              onPress={handleEmailVendor}
            >
              <Text style={styles.contactButtonText}>Email Vendor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{order.customer.name}</Text>
          <Text style={styles.infoText}>{order.customer.phone}</Text>
          <Text style={styles.infoText}>{order.customer.email}</Text>
          <Text style={styles.infoText}>{order.customer.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>{order.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shipping Method:</Text>
            <Text style={styles.detailValue}>{order.shippingMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tracking Number:</Text>
            <Text style={styles.detailValue}>{order.trackingNumber}</Text>
          </View>
          {order.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.trackButton}
        onPress={handleTrackOrder}
      >
        <Text style={styles.trackButtonText}>Track Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  orderNumber: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  orderStatus: {
    fontSize: FONTS.body1,
    fontWeight: '500',
  },
  section: {
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    marginTop: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  itemCard: {
    flexDirection: 'row',
    padding: SIZES.medium,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  itemQuantity: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.medium,
    paddingTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: FONTS.body1,
    color: COLORS.text.secondary,
  },
  totalAmount: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  infoCard: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
  },
  vendorName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  infoText: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
  },
  contactButton: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.small,
  },
  callButton: {
    backgroundColor: COLORS.primary,
  },
  emailButton: {
    backgroundColor: COLORS.secondary,
  },
  contactButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  detailLabel: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: SIZES.medium,
    paddingTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  notesLabel: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
    fontStyle: 'italic',
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    margin: SIZES.large,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: FONTS.body1,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SIZES.large,
  },
});

export default OrderDetailsScreen; 