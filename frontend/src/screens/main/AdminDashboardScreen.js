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

const AdminDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for admin dashboard
  const dashboardData = {
    stats: {
      totalUsers: 1250,
      totalVendors: 45,
      totalOrders: 856,
      totalRevenue: 45600,
    },
    recentUsers: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        joinedDate: '2024-03-25',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'vendor',
        joinedDate: '2024-03-24',
      },
    ],
    pendingVendors: [
      {
        id: '1',
        name: 'Tech Store',
        owner: 'Mike Johnson',
        status: 'pending',
        submittedDate: '2024-03-25',
      },
      {
        id: '2',
        name: 'Fashion Boutique',
        owner: 'Sarah Wilson',
        status: 'pending',
        submittedDate: '2024-03-24',
      },
    ],
    recentOrders: [
      {
        id: '1',
        orderNumber: '#ORD-001',
        customer: 'John Doe',
        vendor: 'Tech Store',
        amount: 150,
        status: 'pending',
        date: '2024-03-25',
      },
      {
        id: '2',
        orderNumber: '#ORD-002',
        customer: 'Jane Smith',
        vendor: 'Fashion Boutique',
        amount: 200,
        status: 'processing',
        date: '2024-03-24',
      },
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
        <Text style={styles.statValue}>{dashboardData.stats.totalUsers}</Text>
        <Text style={styles.statLabel}>Total Users</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{dashboardData.stats.totalVendors}</Text>
        <Text style={styles.statLabel}>Total Vendors</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{dashboardData.stats.totalOrders}</Text>
        <Text style={styles.statLabel}>Total Orders</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>${dashboardData.stats.totalRevenue}</Text>
        <Text style={styles.statLabel}>Total Revenue</Text>
      </View>
    </View>
  );

  const renderRecentUsers = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Users</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserManagement')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dashboardData.recentUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userRole}>{item.role}</Text>
              <Text style={styles.userDate}>{item.joinedDate}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderPendingVendors = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pending Vendors</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VendorManagement')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dashboardData.pendingVendors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vendorCard}
            onPress={() => navigation.navigate('VendorDetails', { vendorId: item.id })}
          >
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorOwner}>{item.owner}</Text>
            </View>
            <View style={styles.vendorMeta}>
              <Text style={styles.vendorStatus}>{item.status}</Text>
              <Text style={styles.vendorDate}>{item.submittedDate}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderRecentOrders = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrderManagement')}>
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
              <Text style={styles.orderCustomer}>{item.customer}</Text>
              <Text style={styles.orderVendor}>{item.vendor}</Text>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderAmount}>${item.amount}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
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
        style={[styles.tab, activeTab === 'users' && styles.activeTab]}
        onPress={() => setActiveTab('users')}
      >
        <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
          Users
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'vendors' && styles.activeTab]}
        onPress={() => setActiveTab('vendors')}
      >
        <Text style={[styles.tabText, activeTab === 'vendors' && styles.activeTabText]}>
          Vendors
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('AdminSettings')}
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
            {renderRecentUsers()}
            {renderPendingVendors()}
            {renderRecentOrders()}
          </>
        )}

        {activeTab === 'users' && (
          <View style={styles.section}>
            <FlatList
              data={dashboardData.recentUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userCard}
                  onPress={() => navigation.navigate('UserDetails', { userId: item.id })}
                >
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                  <View style={styles.userMeta}>
                    <Text style={styles.userRole}>{item.role}</Text>
                    <Text style={styles.userDate}>{item.joinedDate}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {activeTab === 'vendors' && (
          <View style={styles.section}>
            <FlatList
              data={dashboardData.pendingVendors}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.vendorCard}
                  onPress={() => navigation.navigate('VendorDetails', { vendorId: item.id })}
                >
                  <View style={styles.vendorInfo}>
                    <Text style={styles.vendorName}>{item.name}</Text>
                    <Text style={styles.vendorOwner}>{item.owner}</Text>
                  </View>
                  <View style={styles.vendorMeta}>
                    <Text style={styles.vendorStatus}>{item.status}</Text>
                    <Text style={styles.vendorDate}>{item.submittedDate}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
                    <Text style={styles.orderCustomer}>{item.customer}</Text>
                    <Text style={styles.orderVendor}>{item.vendor}</Text>
                  </View>
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderAmount}>${item.amount}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
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
    fontSize: FONTS.body2,
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
  userCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  userInfo: {
    marginBottom: SIZES.small,
  },
  userName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  userEmail: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRole: {
    fontSize: FONTS.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
  userDate: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  vendorCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  vendorInfo: {
    marginBottom: SIZES.small,
  },
  vendorName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  vendorOwner: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  vendorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorStatus: {
    fontSize: FONTS.body2,
    color: COLORS.warning,
    fontWeight: '500',
  },
  vendorDate: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
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
    marginBottom: SIZES.small,
  },
  orderCustomer: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  orderVendor: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default AdminDashboardScreen; 