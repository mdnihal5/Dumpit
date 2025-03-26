import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  Loader, 
  Divider,
  Button
} from '../../components';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../../styles';
import userService from '../../services/userService';
import { logout } from '../../services/authService';
import { DEFAULT_AVATAR } from '../../config';

const ProfileOption = ({ icon, title, subtitle, onPress, showChevron = true, rightElement }) => (
  <TouchableOpacity 
    style={styles.optionContainer}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.optionIconContainer}>
      {icon}
    </View>
    
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    
    {rightElement ? (
      rightElement
    ) : (
      showChevron && (
        <Feather name="chevron-right" size={20} color={Colors.TEXT.SECONDARY} />
      )
    )}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile();
      
      if (response.success) {
        setUser(response.user);
        setNotificationsEnabled(response.user.preferences?.notifications || true);
      } else {
        Alert.alert('Error', response.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by auth state listener
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
          }
        }
      ]
    );
  };

  const toggleNotifications = async (value) => {
    try {
      setNotificationsEnabled(value);
      const response = await userService.updateUserPreferences({
        notifications: value
      });
      
      if (!response.success) {
        // Revert the toggle if failed
        setNotificationsEnabled(!value);
        Alert.alert('Error', response.message || 'Failed to update preference');
      }
    } catch (error) {
      console.error('Error updating preference:', error);
      // Revert the toggle if failed
      setNotificationsEnabled(!value);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return <Loader fullscreen text="Loading profile..." />;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Profile" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile. Please try again.</Text>
          <Button
            title="Retry"
            onPress={loadUserProfile}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Profile"
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
            <Feather name="edit" size={24} color={Colors.TEXT.PRIMARY} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user.avatar || DEFAULT_AVATAR }} 
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        
        <Divider marginVertical={SPACING.LARGE} />
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileOption
            icon={<Feather name="user" size={22} color={Colors.PRIMARY} />}
            title="Personal Information"
            onPress={() => navigation.navigate('PersonalInfo')}
          />
          
          <ProfileOption
            icon={<Feather name="map-pin" size={22} color={Colors.PRIMARY} />}
            title="Addresses"
            subtitle={`${user.addresses?.length || 0} saved addresses`}
            onPress={() => navigation.navigate('Addresses')}
          />
          
          <ProfileOption
            icon={<Feather name="credit-card" size={22} color={Colors.PRIMARY} />}
            title="Payment Methods"
            subtitle={`${user.paymentMethods?.length || 0} saved payment methods`}
            onPress={() => navigation.navigate('PaymentMethods')}
          />
          
          <ProfileOption
            icon={<Feather name="bell" size={22} color={Colors.PRIMARY} />}
            title="Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors.GRAY.MEDIUM, true: `${Colors.PRIMARY}80` }}
                thumbColor={notificationsEnabled ? Colors.PRIMARY : Colors.GRAY.LIGHT}
              />
            }
            showChevron={false}
          />
        </View>
        
        <Divider marginVertical={SPACING.LARGE} />
        
        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          
          <ProfileOption
            icon={<Feather name="package" size={22} color={Colors.INFO} />}
            title="My Orders"
            onPress={() => navigation.navigate('Orders')}
          />
          
          <ProfileOption
            icon={<Feather name="refresh" size={22} color={Colors.INFO} />}
            title="Return Orders"
            onPress={() => navigation.navigate('Returns')}
          />
          
          <ProfileOption
            icon={<Feather name="heart" size={22} color={Colors.INFO} />}
            title="Wishlist"
            onPress={() => navigation.navigate('Wishlist')}
          />
        </View>
        
        <Divider marginVertical={SPACING.LARGE} />
        
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <ProfileOption
            icon={<Feather name="help-circle" size={22} color={Colors.WARNING} />}
            title="Help & Support"
            onPress={() => navigation.navigate('Support')}
          />
          
          <ProfileOption
            icon={<Feather name="file-text" size={22} color={Colors.WARNING} />}
            title="Terms & Conditions"
            onPress={() => navigation.navigate('Terms')}
          />
          
          <ProfileOption
            icon={<Feather name="shield" size={22} color={Colors.WARNING} />}
            title="Privacy Policy"
            onPress={() => navigation.navigate('Privacy')}
          />
          
          <ProfileOption
            icon={<Feather name="log-out" size={22} color={Colors.ERROR} />}
            title="Logout"
            onPress={handleLogout}
            showChevron={false}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.GRAY.LIGHT,
  },
  userInfo: {
    marginLeft: SPACING.LARGE,
  },
  userName: {
    ...Typography.TYPOGRAPHY.H4,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    marginBottom: SPACING.TINY,
  },
  userEmail: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
  },
  section: {
    paddingHorizontal: SPACING.LARGE,
    marginBottom: SPACING.LARGE,
  },
  sectionTitle: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    textTransform: 'uppercase',
    marginBottom: SPACING.MEDIUM,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER.LIGHT,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MEDIUM,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  optionSubtitle: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    marginTop: SPACING.TINY,
  },
  versionContainer: {
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  versionText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.TERTIARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  errorText: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LARGE,
  },
  errorButton: {
    minWidth: 150,
  },
});

export default ProfileScreen; 