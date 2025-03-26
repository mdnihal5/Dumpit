import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  OrderCard, 
  Loader, 
  Empty, 
  Divider 
} from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import orderService from '../../services/orderService';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let filterParams = {};
      
      if (activeTab === 'active') {
        filterParams.status = ['processing', 'shipped'];
      } else if (activeTab === 'completed') {
        filterParams.status = ['delivered', 'cancelled'];
      }
      
      const response = await orderService.getOrders({ filters: filterParams });
      
      if (response.success) {
        setOrders(response.orders);
      } else {
        Alert.alert('Error', response.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleTrackOrder = (order) => {
    if (order.trackingInfo) {
      navigation.navigate('TrackOrder', { orderId: order._id });
    } else {
      Alert.alert('No Tracking Available', 'Tracking information is not available for this order yet.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
      onTrack={handleTrackOrder}
    />
  );

  const renderTabButton = (tabName, label) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabName && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tabName && styles.activeTabButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <Empty
      title="No Orders Found"
      message={
        activeTab === 'all'
          ? "You haven't placed any orders yet."
          : activeTab === 'active'
          ? "You don't have any active orders."
          : "You don't have any completed orders."
      }
      buttonText="Browse Products"
      onButtonPress={() => navigation.navigate('Home')}
      icon={<Feather name="package" size={60} color={Colors.TEXT.SECONDARY} />}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Orders"
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={Colors.TEXT.PRIMARY} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.tabsContainer}>
        {renderTabButton('all', 'All Orders')}
        {renderTabButton('active', 'Active')}
        {renderTabButton('completed', 'Completed')}
      </View>
      
      <Divider marginVertical={0} />
      
      {loading && !refreshing ? (
        <Loader fullscreen text="Loading orders..." />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.PRIMARY]}
              tintColor={Colors.PRIMARY}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER.LIGHT,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.MEDIUM,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.PRIMARY,
  },
  tabButtonText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
  },
  activeTabButtonText: {
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  listContent: {
    padding: SPACING.MEDIUM,
    flexGrow: 1,
  },
});

export default OrdersScreen; 