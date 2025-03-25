import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const VendorDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for vendor dashboard
  const dashboardData = {
    stats: {
      totalOrders: 156,
      pendingOrders: 23,
      totalRevenue: 12500,
      averageRating: 4.5,
    },
    recentOrders: [
      {
        id: '1',
        orderNumber: '#ORD-001',
        customer: 'John Doe',
        amount: 150,
        status: 'pending',
        date: '2024-03-25',
      },
      {
        id: '2',
        orderNumber: '#ORD-002',
        customer: 'Jane Smith',
        amount: 200,
        status: 'processing',
        date: '2024-03-24',
      },
      // Add more mock orders...
    ],
    topProducts: [
      {
        id: '1',
        name: 'Product 1',
        sales: 45,
        revenue: 675,
      },
      {
        id: '2',
        name: 'Product 2',
        sales: 32,
        revenue: 480,
      },
      // Add more mock products...
    ],
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement API calls to refresh data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{dashboardData.stats.totalOrders}</Text>
        <Text style={styles.statLabel}>Total Orders</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{dashboardData.stats.pendingOrders}</Text>
        <Text style={styles.statLabel}>Pending Orders</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>${dashboardData.stats.totalRevenue}</Text>
        <Text style={styles.statLabel}>Total Revenue</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{dashboardData.stats.averageRating}</Text>
        <Text style={styles.statLabel}>Avg Rating</Text>
      </View>
    </View>
  );

  const renderRecentOrders = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VendorOrders')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dashboardData.recentOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>{item.orderNumber}</Text>
              <Text style={[
                styles.orderStatus,
                { color: item.status === 'pending' ? COLORS.warning : COLORS.success }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.customerName}>{item.customer}</Text>
              <Text style={styles.orderAmount}>${item.amount}</Text>
            </View>
            <Text style={styles.orderDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTopProducts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProductManagement')}>
          <Text style={styles.viewAll}>Manage Products</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dashboardData.topProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.productStats}>
              <Text style={styles.productSales}>{item.sales} sales</Text>
              <Text style={styles.productRevenue}>${item.revenue}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
        onPress={() => setActiveTab('orders')}
      >
        <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
          Orders
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'products' && styles.activeTab]}
        onPress={() => setActiveTab('products')}
      >
        <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
          Products
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendor Dashboard</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('VendorSettings')}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabs()}

        {activeTab === 'overview' && (
          <>
            {renderStats()}
            {renderRecentOrders()}
            {renderTopProducts()}
          </>
        )}

        {activeTab === 'orders' && (
          <View style={styles.section}>
            <FlatList
              data={dashboardData.recentOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.orderCard}
                  onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
                >
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                    <Text style={[
                      styles.orderStatus,
                      { color: item.status === 'pending' ? COLORS.warning : COLORS.success }
                    ]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.customerName}>{item.customer}</Text>
                    <Text style={styles.orderAmount}>${item.amount}</Text>
                  </View>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {activeTab === 'products' && (
          <View style={styles.section}>
            <FlatList
              data={dashboardData.topProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                >
                  <Text style={styles.productName}>{item.name}</Text>
                  <View style={styles.productStats}>
                    <Text style={styles.productSales}>{item.sales} sales</Text>
                    <Text style={styles.productRevenue}>${item.revenue}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  settingsButton: {
    padding: SIZES.small,
  },
  settingsButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.small,
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.body1,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.medium,
    gap: SIZES.medium,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  statValue: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  statLabel: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  section: {
    padding: SIZES.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  viewAll: {
    fontSize: FONTS.body2,
    color: COLORS.primary,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  orderNumber: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  orderStatus: {
    fontSize: FONTS.body2,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  customerName: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  orderAmount: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  orderDate: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  productCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  productName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productSales: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  productRevenue: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
});

export default VendorDashboardScreen; 