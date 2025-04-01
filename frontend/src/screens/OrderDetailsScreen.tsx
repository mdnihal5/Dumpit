import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../utils/theme';
import { orderService } from '../services/api';
import Header from '../components/Header';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getProductImage } from '../utils/assetUtils';
import commonStyles from '../utils/commonStyles';

// Order types
import { Order, OrderItem } from '../types/order';
import { Order as ApiOrder } from '../api/types';

// Adapter function for API order to app order format
const adaptApiOrderToAppOrder = (apiOrder: ApiOrder): Order => {
  return {
    _id: apiOrder._id,
    orderNumber: apiOrder._id.substring(0, 8).toUpperCase(), // Generate order number from ID if not available
    items: apiOrder.items.map(item => ({
      _id: typeof item.product === 'string' ? item.product : item.product._id,
      product: {
        _id: typeof item.product === 'string' ? item.product : item.product._id,
        name: typeof item.product === 'string' ? 'Product' : item.product.name,
        price: item.price / item.quantity, // Calculate unit price if not available
        images: typeof item.product === 'string' ? [] : item.product.images,
      },
      quantity: item.quantity,
      price: item.price,
    })),
    billing: {
      subtotal: apiOrder.total * 0.9, // Estimate subtotal if not available
      tax: apiOrder.total * 0.05, // Estimate tax if not available
      shipping: apiOrder.total * 0.05, // Estimate shipping if not available
      total: apiOrder.total,
    },
    status: apiOrder.status,
    paymentStatus: 'paid', // Default to paid if not available
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    shipping: apiOrder.shippingAddress ? {
      address: {
        street: apiOrder.shippingAddress.addressLine1,
        city: apiOrder.shippingAddress.city,
        state: apiOrder.shippingAddress.state,
        zipCode: apiOrder.shippingAddress.postalCode,
      }
    } : undefined,
  };
};

// Mock order for fallback
const MOCK_ORDER: Order = {
  _id: '1',
  orderNumber: 'ORD-001',
  items: [
    {
      _id: 'item1',
      product: {
        _id: 'prod1',
        name: 'Recycled Paper',
        price: 12.99,
        images: [],
      },
      quantity: 2,
      price: 25.98
    },
    {
      _id: 'item2',
      product: {
        _id: 'prod2',
        name: 'Compost Bin',
        price: 35.50,
        images: [],
      },
      quantity: 1,
      price: 35.50
    }
  ],
  billing: {
    subtotal: 61.48,
    tax: 6.15,
    shipping: 5.00,
    total: 72.63
  },
  status: 'delivered',
  paymentStatus: 'paid',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  shipping: {
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  }
};

type Props = NativeStackScreenProps<MainStackParamList, 'OrderDetails'>;

const OrderDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      
      if (response.data && response.data.success) {
        const adaptedOrder = adaptApiOrderToAppOrder(response.data.data);
        setOrder(adaptedOrder);
      } else {
        console.warn('API returned unsuccessful response, using mock data');
        setOrder(MOCK_ORDER);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert(
        'Error',
        'Unable to load order details. Please try again later.'
      );
      setOrder(MOCK_ORDER);
    } finally {
      setLoading(false);
    }
  };

  // Get status color based on order status
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'processing':
        return colors.info;
      case 'shipped':
        return colors.primary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.darkGray;
    }
  };

  // Get status icon based on order status
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'processing':
        return 'refresh-cw';
      case 'shipped':
        return 'truck';
      case 'delivered':
        return 'check-circle';
      case 'cancelled':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="Order Details" showBack onBackPress={() => navigation.goBack()} />
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="Order Details" showBack onBackPress={() => navigation.goBack()} />
        <View style={commonStyles.emptyContainer}>
          <Feather name="alert-circle" size={64} color={colors.error} />
          <Text style={commonStyles.emptyTitle}>Order Not Found</Text>
          <Text style={commonStyles.emptyText}>
            The order you are looking for could not be found.
          </Text>
          <TouchableOpacity
            style={[commonStyles.button, styles.returnButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonText}>Return to Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="Order Details" showBack onBackPress={() => navigation.goBack()} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Order Summary Card */}
        <View style={commonStyles.card}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
              <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Feather name={getStatusIcon(order.status) as any} size={14} color={colors.white} />
              <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        
        {/* Order Items */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          {order.items.map((item, index) => (
            <View key={item._id || index} style={styles.itemRow}>
              <Image
                source={getProductImage(item.product.images?.[0])}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.product.price)}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.price)}</Text>
            </View>
          ))}
        </View>
        
        {/* Shipping Information */}
        {order.shipping && (
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={colors.darkGray} />
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{order.shipping.address.street}</Text>
                <Text style={styles.addressText}>
                  {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zipCode}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Payment Information */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Feather name="credit-card" size={16} color={colors.darkGray} />
            <Text style={styles.infoText}>
              {order.paymentStatus === 'paid' ? 'Payment completed' : 'Payment pending'}
            </Text>
          </View>
          
          <View style={styles.billingSummary}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Subtotal</Text>
              <Text style={styles.billingValue}>{formatCurrency(order.billing.subtotal)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Shipping</Text>
              <Text style={styles.billingValue}>{formatCurrency(order.billing.shipping)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Tax</Text>
              <Text style={styles.billingValue}>{formatCurrency(order.billing.tax)}</Text>
            </View>
            <View style={[styles.billingRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.billing.total)}</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <TouchableOpacity style={[commonStyles.button, styles.cancelButton]}>
              <Text style={commonStyles.buttonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[commonStyles.button, styles.supportButton]}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={commonStyles.buttonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: typography.caption.fontSize,
    color: colors.darkGray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.white,
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: spacing.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.lightGray,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    fontSize: typography.body1.fontSize,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
  },
  itemQuantity: {
    fontSize: typography.caption.fontSize,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  itemTotal: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  addressContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  addressText: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
    lineHeight: 20,
  },
  infoText: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
    marginLeft: spacing.md,
  },
  billingSummary: {
    marginTop: spacing.md,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  billingLabel: {
    fontSize: typography.body2.fontSize,
    color: colors.darkGray,
  },
  billingValue: {
    fontSize: typography.body2.fontSize,
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: typography.h4.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.h4.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  actionsContainer: {
    marginTop: spacing.lg,
  },
  cancelButton: {
    backgroundColor: colors.error,
    marginBottom: spacing.md,
  },
  supportButton: {
    backgroundColor: colors.info,
  },
  returnButton: {
    marginTop: spacing.md,
  },
});

export default OrderDetailsScreen; 