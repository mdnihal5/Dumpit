import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../utils/theme';
import Header from '../components/Header';
import { notificationService } from '../api/services';

// Types for notification data
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'other';
  read: boolean;
  createdAt: string;
  linkTo?: string;
  linkId?: string;
}

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  systemAlerts: boolean;
}

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Notifications'>,
  BottomTabScreenProps<MainTabParamList, 'Notifications'>
>;

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  // States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: true,
    systemAlerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      try {
        // Get notifications from the API
        const response = await notificationService.getNotifications();
        
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setNotifications(response.data.data as Notification[]);
        } else {
          throw new Error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications from API:', error);
        // Use mock data in development only
        if (__DEV__) {
          console.warn('Using mock notification data');
          const mockNotifications: Notification[] = [
            {
              _id: '1',
              title: 'Order Delivered',
              message: 'Your order #ORD-001 has been delivered successfully.',
              type: 'order',
              read: false,
              createdAt: new Date().toISOString(),
              linkTo: 'Order',
              linkId: 'ORD-001'
            },
            {
              _id: '2',
              title: 'Special Offer',
              message: 'Get 20% off on all recycling products this weekend!',
              type: 'promo',
              read: true,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '3',
              title: 'System Maintenance',
              message: 'Our app will be under maintenance on Saturday from 2-4 AM.',
              type: 'system',
              read: true,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: '4',
              title: 'Order Processing',
              message: 'Your order #ORD-002 is being processed.',
              type: 'order',
              read: false,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ];
          setNotifications(mockNotifications);
        } else {
          // In production, show empty state
          setNotifications([]);
          Alert.alert('Error', 'Unable to load your notifications. Please try again later.');
        }
      }
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      Alert.alert('Error', 'Unable to load your notifications. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      // Update UI immediately
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Make API call to update read status
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // No need to show alert for this - UI is already updated
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update UI immediately
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          read: true
        }))
      );
      
      // Make API call
      await notificationService.markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // No need to revert UI - it's a non-critical operation
    }
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update UI immediately
              setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification._id !== id)
              );
              
              // Make API call
              await notificationService.deleteNotification(id);
              Alert.alert('Success', 'Notification deleted successfully');
            } catch (error) {
              console.error('Failed to delete notification:', error);
              Alert.alert('Error', 'Failed to delete notification. Please try again.');
              // Could revert UI here if needed, but not necessary for this operation
            }
          }
        }
      ]
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update UI immediately
              setNotifications([]);
              
              // Make API call
              await notificationService.clearAllNotifications();
              Alert.alert('Success', 'All notifications cleared successfully');
            } catch (error) {
              console.error('Failed to clear notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications. Please try again.');
              // Could refresh the list here if needed
            }
          }
        }
      ]
    );
  };
  
  // Toggle notification settings
  const toggleSetting = async (setting: keyof NotificationSettings) => {
    try {
      // Update UI immediately
      setSettings(prevSettings => ({
        ...prevSettings,
        [setting]: !prevSettings[setting]
      }));
      
      // Save settings to API
      await notificationService.updateSettings({
        [setting]: !settings[setting]
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      
      // Revert UI change if API fails
      setSettings(prevSettings => ({
        ...prevSettings,
        [setting]: !prevSettings[setting]
      }));
      
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    }
  };
  
  // Get notification settings from API
  const fetchNotificationSettings = async () => {
    try {
      const response = await notificationService.getSettings();
      if (response.data && response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Keep default settings if API fails
    }
  };
  
  // Fetch both notifications and settings on mount
  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, []);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'package';
      case 'promo':
        return 'tag';
      case 'system':
        return 'alert-circle';
      default:
        return 'bell';
    }
  };
  
  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => {
        markAsRead(item._id);
        // Navigate to linked screen if available
        if (item.linkTo && item.linkId) {
          // @ts-ignore - dynamic navigation
          navigation.navigate(item.linkTo, { id: item.linkId });
        }
      }}
    >
      <View style={styles.notificationIconContainer}>
        <Feather
          name={getNotificationIcon(item.type)}
          size={24}
          color={colors.primary}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDate}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text style={styles.notificationMessage}>{item.message}</Text>
        
        {!item.read && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item._id)}
      >
        <Feather name="trash-2" size={18} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  // Render settings section
  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Order Updates</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about your orders
          </Text>
        </View>
        <Switch
          value={settings.orderUpdates}
          onValueChange={() => toggleSetting('orderUpdates')}
          trackColor={{ false: colors.lightGray, true: colors.primary + '80' }}
          thumbColor={settings.orderUpdates ? colors.primary : colors.white}
        />
      </View>
      
      <View style={styles.settingSeparator} />
      
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Promotions</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about discounts and special offers
          </Text>
        </View>
        <Switch
          value={settings.promotions}
          onValueChange={() => toggleSetting('promotions')}
          trackColor={{ false: colors.lightGray, true: colors.primary + '80' }}
          thumbColor={settings.promotions ? colors.primary : colors.white}
        />
      </View>
      
      <View style={styles.settingSeparator} />
      
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>System Alerts</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about system maintenance and updates
          </Text>
        </View>
        <Switch
          value={settings.systemAlerts}
          onValueChange={() => toggleSetting('systemAlerts')}
          trackColor={{ false: colors.lightGray, true: colors.primary + '80' }}
          thumbColor={settings.systemAlerts ? colors.primary : colors.white}
        />
      </View>
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell-off" size={60} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You don't have any notifications yet. Check back later!
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        showBack={true}
        rightIcon={
          <View style={styles.headerButtons}>
            {notifications.length > 0 && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={markAllAsRead}
              >
                <Feather name="check-square" size={22} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('NotificationSettings')}
            >
              <Feather name="settings" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        }
      />
      
      {showSettings ? (
        renderSettings()
      ) : loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {notifications.length > 0 && (
            <View style={styles.actionsContainer}>
              <Text style={styles.notificationCount}>
                {notifications.filter(n => !n.read).length} unread
              </Text>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearAllNotifications}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderNotificationItem}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  notificationCount: {
    ...typography.body2,
    color: colors.darkGray,
  } as TextStyle,
  clearAllButton: {
    padding: spacing.xs,
  },
  clearAllText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600' as '600',
  } as TextStyle,
  listContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  unreadNotification: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    ...typography.body1,
    fontWeight: '600' as '600',
    color: colors.text,
    flex: 1,
  } as TextStyle,
  notificationDate: {
    ...typography.caption,
    color: colors.darkGray,
    marginLeft: spacing.sm,
  } as TextStyle,
  notificationMessage: {
    ...typography.body2,
    color: colors.darkGray,
  } as TextStyle,
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  } as TextStyle,
  emptyText: {
    ...typography.body2,
    color: colors.darkGray,
    textAlign: 'center',
  } as TextStyle,
  settingsContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.body1,
    fontWeight: '600' as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  } as TextStyle,
  settingDescription: {
    ...typography.body2,
    color: colors.darkGray,
  } as TextStyle,
  settingSeparator: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
});

export default NotificationsScreen; 