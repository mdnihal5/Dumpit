import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, OrderCard } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const OrderStatus = ({ status }) => {
  let color;
  let icon;
  
  switch (status) {
    case 'delivered':
      color = COLORS.success;
      icon = 'checkmark-circle';
      break;
    case 'processing':
    case 'confirmed':
      color = COLORS.primary;
      icon = 'time-outline';
      break;
    case 'shipped':
      color = COLORS.info;
      icon = 'car-outline';
      break;
    case 'cancelled':
      color = COLORS.error;
      icon = 'close-circle-outline';
      break;
    case 'pending':
    default:
      color = COLORS.warning;
      icon = 'ellipsis-horizontal-circle-outline';
      break;
  }
  
  return (
    <View style={[styles.statusContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={16} color={color} style={styles.statusIcon} />
      <Text style={[styles.statusText, { color }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [dispatch]);

  useEffect(() => {
    filterOrders();
  }, [orders, activeTab]);

  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders()).unwrap();
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filterOrders = () => {
    if (!orders) return;

    if (activeTab === 'all') {
      setFilteredOrders([...orders]);
    } else {
      const filtered = orders.filter(order => order.status.toLowerCase() === activeTab);
      setFilteredOrders(filtered);
    }
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <FlatList
        horizontal
        data={STATUS_TABS}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === item.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(item.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === item.key && styles.activeTabText
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsList}
      />
    </View>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'all'
          ? "You haven't placed any orders yet"
          : `You don't have any ${activeTab} orders`}
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Orders"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      {renderTabs()}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyOrders}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 1,
  },
  tabsList: {
    paddingHorizontal: SIZES.padding,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  ordersList: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginTop: SIZES.padding,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SIZES.padding,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  shopNowText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
});

export default OrdersScreen; 