import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../utils/theme';
import { notificationService } from '../services/api';

interface HomeHeaderProps {
  userName?: string;
  avatarUrl?: string;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = '',
  avatarUrl,
  onSearchPress,
  onMenuPress,
}) => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadNotifications();
    
    // Subscribe to focus events to refresh unread count when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUnreadNotifications();
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.data && response.data.success) {
        const unreadNotifications = response.data.data.filter(
          (notification: any) => !notification.read
        );
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const goToNotifications = () => {
    // @ts-ignore
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      

      <View style={styles.titleContainer}>
        <Text style={styles.greeting}>Hello, {userName || 'User'}</Text>
        <Text style={styles.subtitle}>Let's recycle & earn 💰</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSearchPress}
        >
          <Feather name="search" size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={goToNotifications}
        >
          <Feather name="bell" size={22} color={colors.primary} />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Profile');
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              defaultSource={require('../../assets/images/default-avatar.png')}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userName?.charAt(0) || 'U'}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuButton: {
    padding: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  greeting: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  subtitle: {
    ...typography.body2,
    color: colors.darkGray,
    marginTop: spacing.xs / 2,
  } as TextStyle,
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.xs,
    marginHorizontal: spacing.xs / 2,
    borderRadius: 8,
    backgroundColor: colors.background,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  } as TextStyle,
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.primary,
  } as TextStyle,
});

export default HomeHeader; 