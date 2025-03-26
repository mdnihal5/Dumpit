import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile, getUserProfile } from '../../redux/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';

const MenuItem = ({ title, icon, onPress, rightText, showBorder = true }) => (
  <TouchableOpacity 
    style={[styles.menuItem, showBorder && styles.menuItemBorder]} 
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color={COLORS.text} style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    
    <View style={styles.menuRight}>
      {rightText && <Text style={styles.menuRightText}>{rightText}</Text>}
      <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
    </View>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
    
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      setRefreshing(true);
      await dispatch(getUserProfile()).unwrap();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load profile. Please try again.'
      );
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };
  
  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture');
        return;
      }
      
      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        // Upload image
        const imageUri = result.assets[0].uri;
        
        // Here you would normally upload the image to your server
        // and get back a URL. For this example, we'll just simulate it.
        
        // Update profile in Redux
        try {
          const formData = new FormData();
          formData.append('profileImage', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile-picture.jpg',
          });
          
          await dispatch(updateProfile(formData)).unwrap();
          setProfileImage(imageUri);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          Alert.alert(
            'Error',
            error?.message || 'Failed to update profile picture. Please try again.'
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while picking an image');
    }
  };
  
  const handleLogout = () => {
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
              await dispatch(logout()).unwrap();
              // Navigation is handled by the AppNavigator based on auth state
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Logout failed. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="My Profile" 
        showBack={false}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handlePickImage}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={14} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuContainer}>
            <MenuItem
              title="My Orders"
              icon="document-text-outline"
              onPress={() => navigation.navigate('Orders')}
            />
            
            <MenuItem
              title="My Addresses"
              icon="location-outline"
              onPress={() => navigation.navigate('AddressList')}
            />
            
            <MenuItem
              title="Payment Methods"
              icon="card-outline"
              onPress={() => navigation.navigate('PaymentMethods')}
              showBorder={false}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuContainer}>
            <MenuItem
              title="Notifications"
              icon="notifications-outline"
              onPress={() => navigation.navigate('Notifications')}
            />
            
            <MenuItem
              title="Language"
              icon="language-outline"
              rightText="English"
              onPress={() => navigation.navigate('Language')}
              showBorder={false}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.menuContainer}>
            <MenuItem
              title="Help & Support"
              icon="help-circle-outline"
              onPress={() => navigation.navigate('Support')}
            />
            
            <MenuItem
              title="About Us"
              icon="information-circle-outline"
              onPress={() => navigation.navigate('About')}
            />
            
            <MenuItem
              title="Privacy Policy"
              icon="shield-checkmark-outline"
              onPress={() => navigation.navigate('PrivacyPolicy')}
              showBorder={false}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    backgroundColor: COLORS.white,
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profileInitials: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editProfileText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
    paddingHorizontal: SIZES.padding,
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: SIZES.padding,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRightText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.error,
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});

export default ProfileScreen; 