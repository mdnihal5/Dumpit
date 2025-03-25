import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { updateNotificationSettings, markNotificationAsRead, deleteNotification } from '../../store/slices/notificationSlice';

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, settings } = useSelector((state) => state.notifications);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleSetting = (setting) => {
    dispatch(updateNotificationSettings({ [setting]: !settings[setting] }));
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteNotification(notificationId));
            Alert.alert('Success', 'Notification deleted successfully');
          },
        },
      ]
    );
  };

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.read && styles.unreadNotification,
      ]}
      onPress={() => handleMarkAsRead(notification.id)}
    >
      <View style={styles.notificationIcon}>
        <Icon
          name={getNotificationIcon(notification.type)}
          size={24}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>
          {formatNotificationTime(notification.timestamp)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(notification.id)}
      >
        <Icon name="delete-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Notification Settings</Text>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Order Updates</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about your order status
          </Text>
        </View>
        <Switch
          value={settings.orderUpdates}
          onValueChange={() => handleToggleSetting('orderUpdates')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Promotions</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about offers and promotions
          </Text>
        </View>
        <Switch
          value={settings.promotions}
          onValueChange={() => handleToggleSetting('promotions')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>News & Updates</Text>
          <Text style={styles.settingDescription}>
            Receive notifications about app updates and news
          </Text>
        </View>
        <Switch
          value={settings.news}
          onValueChange={() => handleToggleSetting('news')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
    </View>
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'package-variant';
      case 'promotion':
        return 'tag-multiple';
      case 'news':
        return 'newspaper';
      default:
        return 'bell';
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Icon name="cog" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {showSettings ? (
          renderSettings()
        ) : (
          <>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="bell-off" size={48} color={COLORS.secondary} />
                <Text style={styles.emptyStateText}>No notifications</Text>
              </View>
            ) : (
              notifications.map(renderNotificationItem)
            )}
          </>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.small,
  },
  title: {
    fontSize: FONTS.size.h2,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: SPACING.small,
  },
  scrollView: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    marginHorizontal: SPACING.large,
    marginTop: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
  },
  unreadNotification: {
    backgroundColor: COLORS.primaryLight,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.medium,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  notificationMessage: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginBottom: SPACING.small,
  },
  notificationTime: {
    fontSize: FONTS.size.h6,
    color: COLORS.secondary,
  },
  deleteButton: {
    padding: SPACING.small,
  },
  settingsContainer: {
    padding: SPACING.large,
  },
  settingsTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.large,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.medium,
  },
  settingLabel: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  settingDescription: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  emptyStateText: {
    fontSize: FONTS.size.h4,
    color: COLORS.secondary,
    marginTop: SPACING.medium,
  },
});

export default NotificationsScreen; 