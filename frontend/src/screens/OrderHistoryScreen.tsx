import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextStyle,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../utils/theme';
import { orderService } from '../services/api';
import Header from '../components/Header';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getProductImage } from '../utils/assetUtils';
import commonStyles from '../utils/commonStyles';

// Order types
import { Order, OrderItem } from '../types/order';
import { Order as ApiOrder } from '../api/types';

// Mock data as fallback in case API fails
const MOCK_ORDERS: Order[] = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    items: [
      {
        _id: 'item1',
        product: {
          _id: 'prod1',
          name: 'Recycled Paper',
          price: 12.99,
        },
        quantity: 2,
        price: 25.98
      }
    ],
    billing: {
      subtotal: 25.98,
      tax: 2.60,
      shipping: 5.00,
      total: 33.58
    },
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    items: [
      {
        _id: 'item2',
        product: {
          _id: 'prod2',
          name: 'Compost Bin',
          price: 35.50,
        },
        quantity: 1,
        price: 35.50
      }
    ],
    billing: {
      subtotal: 35.50,
      tax: 3.55,
      shipping: 5.00,
      total: 44.05
    },
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'OrderHistory'>,
  BottomTabScreenProps<MainTabParamList, 'OrderHistory'>
>;

// Convert API order model to app order model
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
  };
};

const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching order history...');
      
      try {
        // Use the correctly named endpoint from the service
        const response = await orderService.getMyOrders();
        console.log('Orders response:', response);
        
        if (response.data && response.data.success) {
          const apiOrdersData = response.data.data || [];
          console.log(`Successfully fetched ${apiOrdersData.length} orders`);
          
          // Convert API orders to app orders
          const adaptedOrders = apiOrdersData.map(adaptApiOrderToAppOrder);
          setOrders(adaptedOrders);
        } else {
          console.warn('API returned unsuccessful response, using mock data', response.data);
          setOrders(MOCK_ORDERS);
        }
      } catch (apiError) {
        console.error('API call failed, using mock data', apiError);
        setOrders(MOCK_ORDERS);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert(
        'Error', 
        'Unable to load your orders. Please try again later.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  // View order details
  const viewOrderDetails = (orderId: string) => {
    // Navigate to order details screen
    navigation.navigate('OrderDetails', { orderId });
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
  
  // Render order item
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[commonStyles.card, styles.orderCard]}
      onPress={() => viewOrderDetails(item._id)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Feather name={getStatusIcon(item.status) as any} size={12} color={colors.white} />
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.orderDate}>
        <Feather name="calendar" size={14} color={colors.mediumGray} />
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <View style={commonStyles.divider} />
      
      <View style={styles.itemsContainer}>
        {item.items.map((orderItem: OrderItem, index: number) => (
          <View key={orderItem._id || index} style={styles.itemRow}>
            <Image
              source={getProductImage(orderItem.product.images?.[0])}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {orderItem.product.name}
              </Text>
              <Text style={styles.itemMeta}>
                Qty: {orderItem.quantity} x {formatCurrency(orderItem.product.price)}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatCurrency(orderItem.price)}
            </Text>
          </View>
        ))}
      </View>
      
      {item.items.length > 2 && (
        <Text style={styles.moreItems}>
          +{item.items.length - 2} more item(s)
        </Text>
      )}
      
      <View style={commonStyles.divider} />
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(item.billing.total)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="Order History" showBack={true} />
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={commonStyles.emptyContainer}>
      <Feather name="shopping-bag" size={64} color={colors.mediumGray} />
      <Text style={commonStyles.emptyTitle}>No Orders Yet</Text>
      <Text style={commonStyles.emptyText}>
        You haven't placed any orders yet. Start shopping to see your orders here.
      </Text>
      <TouchableOpacity
        style={[commonStyles.button, styles.shopButton]}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={commonStyles.buttonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="Order History" showBack={false} />
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.white,
    marginLeft: spacing.xs / 2,
  },
  orderDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: spacing.xs,
  },
  itemsContainer: {
    marginBottom: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lightGray,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.text,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: spacing.xs / 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.text,
    marginLeft: spacing.sm,
  },
  moreItems: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500' as TextStyle['fontWeight'],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.primary,
  },
  shopButton: {
    marginTop: spacing.md,
  },
});

export default OrderHistoryScreen; 