import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import OrderStatus from '../../components/orders/OrderStatus';
import DeliveryTimeline from '../../components/orders/DeliveryTimeline';
import OrderItem from '../../components/orders/OrderItem';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [loading, setLoading] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState([]);

  useEffect(() => {
    fetchTrackingUpdates();
  }, []);

  const fetchTrackingUpdates = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch tracking updates
      // For now, using mock data
      const mockUpdates = [
        {
          status: 'Order Placed',
          timestamp: new Date(order.createdAt),
          location: 'Warehouse',
        },
        {
          status: 'Processing',
          timestamp: new Date(order.createdAt.getTime() + 3600000),
          location: 'Warehouse',
        },
        {
          status: 'Shipped',
          timestamp: new Date(order.createdAt.getTime() + 7200000),
          location: 'In Transit',
        },
        {
          status: 'Out for Delivery',
          timestamp: new Date(order.createdAt.getTime() + 10800000),
          location: 'Local Delivery',
        },
        {
          status: 'Delivered',
          timestamp: new Date(order.createdAt.getTime() + 14400000),
          location: order.address.street,
        },
      ];
      setTrackingUpdates(mockUpdates);
    } catch (error) {
      console.error('Error fetching tracking updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Information</Text>
      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Number</Text>
          <Text style={styles.infoValue}>#{order.orderNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Date</Text>
          <Text style={styles.infoValue}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated Delivery</Text>
          <Text style={styles.infoValue}>
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
  const renderDeliveryAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.addressCard}>
        <Text style={styles.addressName}>{order.address.name}</Text>
        <Text style={styles.addressText}>{order.address.street}</Text>
        <Text style={styles.addressText}>
          {order.address.city}, {order.address.state} {order.address.pincode}
        </Text>
        <Text style={styles.addressText}>{order.address.phone}</Text>
      </View>
    </View>
  );
  const renderOrderItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Items</Text>
      {order.items.map((item) => (
        <OrderItem key={item._id} item={item} />
      ))}
    </View>
  );
  const renderTrackingUpdates = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tracking Updates</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <DeliveryTimeline updates={trackingUpdates} />
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Track Order</Text>
          <Text style={styles.subtitle}>
            Order #{order.orderNumber}
          </Text>
        </View>

        <OrderStatus status={order.status} />

        {renderOrderInfo()}
        {renderDeliveryAddress()}
        {renderOrderItems()}
        {renderTrackingUpdates()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Contact Support"
          variant="outline"
          onPress={() => navigation.navigate('Support')}
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
  },
  title: {
    fontSize: FONTS.size.h1,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: FONTS.size.h2,
    color: COLORS.secondary,
  },
  section: {
    padding: SPACING.large,
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  orderInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  infoLabel: {
    fontSize: FONTS.size.h4,
    color: COLORS.secondary,
  },
  infoValue: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
  },
  addressName: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  addressText: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
  },
  footer: {
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default OrderTrackingScreen; 