import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import OrderStatus from '../../components/orders/OrderStatus';
import OrderItem from '../../components/orders/OrderItem';

const OrderConfirmationScreen = ({ navigation }) => {
  const { currentOrder } = useSelector((state) => state.orders);

  if (!currentOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="check-circle" size={SIZES.extraLarge} color={COLORS.success} />
        <Text style={styles.emptyText}>Order placed successfully!</Text>
        <Button
          title="Continue Shopping"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        />
      </View>
    );
  }

  const renderOrderDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Details</Text>
      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Number</Text>
          <Text style={styles.infoValue}>#{currentOrder.orderNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Date</Text>
          <Text style={styles.infoValue}>
            {new Date(currentOrder.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Method</Text>
          <Text style={styles.infoValue}>{currentOrder.paymentMethod}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Status</Text>
          <Text style={[styles.infoValue, { color: COLORS.success }]}>
            Paid
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDeliveryAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.addressCard}>
        <Text style={styles.addressName}>{currentOrder.address.name}</Text>
        <Text style={styles.addressText}>{currentOrder.address.street}</Text>
        <Text style={styles.addressText}>
          {currentOrder.address.city}, {currentOrder.address.state}{' '}
          {currentOrder.address.pincode}
        </Text>
        <Text style={styles.addressText}>{currentOrder.address.phone}</Text>
      </View>
    </View>
  );

  const renderOrderItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Items</Text>
      {currentOrder.items.map((item) => (
        <OrderItem key={item._id} item={item} />
      ))}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{currentOrder.subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (18%)</Text>
          <Text style={styles.summaryValue}>₹{currentOrder.tax}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹{currentOrder.shipping}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{currentOrder.total}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Icon name="check-circle" size={SIZES.extraLarge} color={COLORS.success} />
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            Thank you for your purchase. We'll notify you when your order is ready
            for delivery.
          </Text>
        </View>

        <OrderStatus status={currentOrder.status} />

        {renderOrderDetails()}
        {renderDeliveryAddress()}
        {renderOrderItems()}
        {renderOrderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Track Order"
          onPress={() => navigation.navigate('OrderTracking', { order: currentOrder })}
          style={styles.trackButton}
        />
        <Button
          title="Continue Shopping"
          variant="outline"
          onPress={() => navigation.navigate('Home')}
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
    flex: 1,
  },
  header: {
    padding: SPACING.large,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.extraLarge,
    fontWeight: 'bold',
    marginTop: SPACING.medium,
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: FONTS.medium,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.medium,
    marginBottom: SPACING.large,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
  },
  section: {
    padding: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  orderInfo: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  infoLabel: {
    fontSize: FONTS.medium,
  },
  infoValue: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
  },
  addressName: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  addressText: {
    fontSize: FONTS.medium,
  },
  summary: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  summaryLabel: {
    fontSize: FONTS.medium,
  },
  summaryValue: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: FONTS.medium,
  },
  totalValue: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
  },
}); 