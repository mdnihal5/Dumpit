import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, updateNotificationPreferences } from '../../redux/slices/userSlice';

const MOCK_NOTIFICATIONS = [
  {
    _id: '1',
    title: 'Order Delivered',
    message: 'Your order #12345 has been delivered successfully.',
    type: 'order',
    read: false,
    createdAt: '2023-07-15T10:30:00Z',
  },
  {
    _id: '2',
    title: 'Special Offer',
    message: 'Get 20% off on all products this weekend!',
    type: 'promotion',
    read: true,
    createdAt: '2023-07-14T08:45:00Z',
  },
  {
    _id: '3',
    title: 'Payment Successful',
    message: 'Your payment of $124.99 for order #12345 was successful.',
    type: 'payment',
    read: false,
    createdAt: '2023-07-12T14:20:00Z',
  },
  {
    _id: '4',
    title: 'New Collection',
    message: 'Check out our new summer collection now available!',
    type: 'promotion',
    read: true,
    createdAt: '2023-07-10T09:15:00Z',
  },
  {
    _id: '5',
    title: 'Order Shipped',
    message: 'Your order #54321 has been shipped and will arrive in 3-5 days.',
    type: 'order',
    read: true,
    createdAt: '2023-07-08T16:40:00Z',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // Temporarily using mock data until backend is ready
  // const { notifications, preferences, loading } = useSelector(state => state.user);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [preferences, setPreferences] = useState({
    orders: true,
    payments: true,
    promotions: true,
    system: true,
  });
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    try {
      setRefreshing(true);
      // When backend is ready
      // await dispatch(getNotifications()).unwrap();
      
      // Using mock data for now
      setNotifications(MOCK_NOTIFICATIONS);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load notifications. Please try again.'
      );
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleMarkAsRead = (notificationId) => {
    // When backend is ready
    // dispatch(markAsRead(notificationId)).unwrap();
    
    // Using mock data for now
    setNotifications(
      notifications.map(notification => 
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleTogglePreference = (type, value) => {
    const updatedPreferences = { ...preferences, [type]: value };
    setPreferences(updatedPreferences);
    
    // When backend is ready
    // dispatch(updateNotificationPreferences(updatedPreferences)).unwrap();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'cube-outline';
      case 'payment':
        return 'card-outline';
      case 'promotion':
        return 'pricetag-outline';
      case 'system':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };
  
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => handleMarkAsRead(item._id)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={item.read ? COLORS.textTertiary : COLORS.primary} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle,
            item.read && styles.readNotificationText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text 
          style={[
            styles.notificationMessage,
            item.read && styles.readNotificationText
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
      </View>
      
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Notifications" 
        onBack={() => navigation.goBack()} 
      />
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={loadNotifications}
        ListHeaderComponent={
          <View style={styles.preferencesContainer}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="cube-outline" size={20} color={COLORS.text} style={styles.preferenceIcon} />
                <Text style={styles.preferenceLabel}>Order Updates</Text>
              </View>
              <Switch
                value={preferences.orders}
                onValueChange={(value) => handleTogglePreference('orders', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                thumbColor={preferences.orders ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="card-outline" size={20} color={COLORS.text} style={styles.preferenceIcon} />
                <Text style={styles.preferenceLabel}>Payment Updates</Text>
              </View>
              <Switch
                value={preferences.payments}
                onValueChange={(value) => handleTogglePreference('payments', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                thumbColor={preferences.payments ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.text} style={styles.preferenceIcon} />
                <Text style={styles.preferenceLabel}>Promotions & Offers</Text>
              </View>
              <Switch
                value={preferences.promotions}
                onValueChange={(value) => handleTogglePreference('promotions', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                thumbColor={preferences.promotions ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
            
            <View style={[styles.preferenceItem, styles.lastPreferenceItem]}>
              <View style={styles.preferenceInfo}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.text} style={styles.preferenceIcon} />
                <Text style={styles.preferenceLabel}>System Updates</Text>
              </View>
              <Switch
                value={preferences.system}
                onValueChange={(value) => handleTogglePreference('system', value)}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                thumbColor={preferences.system ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>We'll notify you when something arrives</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  preferencesContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lastPreferenceItem: {
    borderBottomWidth: 0,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: 8,
    borderRadius: SIZES.radius,
    position: 'relative',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  readNotification: {
    borderLeftColor: COLORS.border,
    backgroundColor: COLORS.white + '80',
  },
  notificationIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  notificationMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  readNotificationText: {
    color: COLORS.textTertiary,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});

export default NotificationsScreen; 