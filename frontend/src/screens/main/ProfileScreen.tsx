import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { Feather } from '@expo/vector-icons';
import { Avatar, Divider } from 'react-native-paper';
import { colors, spacing, typography, shadows, borderRadius } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { profileUpdateSchema } from '../../utils/validation';
import { getUserAvatar } from '../../utils/assetUtils';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isLoading } = useAuth();
  
  // State for form fields
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Form validation using Zod
  const validateForm = () => {
    // Reset all errors
    setNameError('');
    setEmailError('');
    setPhoneError('');
    
    // Validate using Zod schema
    const result = profileUpdateSchema.safeParse({ name, email, phone });
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      
      if (formattedErrors.name?._errors?.length) {
        setNameError(formattedErrors.name._errors[0]);
      }
      
      if (formattedErrors.email?._errors?.length) {
        setEmailError(formattedErrors.email._errors[0]);
      }
      
      if (formattedErrors.phone?._errors?.length) {
        setPhoneError(formattedErrors.phone._errors[0]);
      }
      
      return false;
    }
    
    return true;
  };

  // Save profile changes
  const handleSaveProfile = () => {
    if (validateForm()) {
      // Here you would update user's profile via an API call
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      setIsEditing(false);
    }
  };

  // Cancel editing and reset form
  const handleCancelEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setIsEditing(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get role-specific content
  const getRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'vendor':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Vendor Dashboard</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('ProductManagement')}
            >
              <Feather name="box" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Product Management</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('OrderManagement')}
            >
              <Feather name="shopping-bag" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Order Management</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Reports')}
            >
              <Feather name="bar-chart-2" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Sales Reports</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
          </View>
        );
        
      case 'admin':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Admin Dashboard</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <Feather name="users" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>User Management</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('VendorManagement')}
            >
              <Feather name="briefcase" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Vendor Management</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('CategoryManagement')}
            >
              <Feather name="list" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Category Management</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
          </View>
        );
        
      default: // Regular user
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>My Activities</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('OrderHistory')}
            >
              <Feather name="shopping-bag" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Order History</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('SavedAddresses')}
            >
              <Feather name="map-pin" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Saved Addresses</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Wishlist')}
            >
              <Feather name="heart" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Wishlist</Text>
              <Feather name="chevron-right" size={20} color={colors.mediumGray} />
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Profile" showBack={true} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            {user?.avatar ? (
              <Avatar.Image
                size={80}
                source={getUserAvatar(user.avatar)}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={80}
                label={getUserInitials()}
                style={{ backgroundColor: colors.primary }}
                color={colors.white}
              />
            )}
            {!isEditing && (
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                </View>
              </View>
            )}
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                error={nameError}
                leftIcon={<Feather name="user" size={20} color={colors.mediumGray} />}
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Feather name="mail" size={20} color={colors.mediumGray} />}
                disabled={true} // Email cannot be changed
              />
              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                error={phoneError}
                keyboardType="phone-pad"
                leftIcon={<Feather name="phone" size={20} color={colors.mediumGray} />}
              />
              
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={handleCancelEdit}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveProfile}
                  loading={isLoading}
                  style={styles.saveButton}
                />
              </View>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Feather name="edit" size={18} color={colors.white} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              {/* Role-specific content */}
              {getRoleSpecificContent()}
              
              {/* Account settings */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate('ChangePassword')}
                >
                  <Feather name="lock" size={20} color={colors.text} />
                  <Text style={styles.menuItemText}>Change Password</Text>
                  <Feather name="chevron-right" size={20} color={colors.mediumGray} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <Feather name="bell" size={20} color={colors.text} />
                  <Text style={styles.menuItemText}>Notification Settings</Text>
                  <Feather name="chevron-right" size={20} color={colors.mediumGray} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate('Privacy')}
                >
                  <Feather name="shield" size={20} color={colors.text} />
                  <Text style={styles.menuItemText}>Privacy & Security</Text>
                  <Feather name="chevron-right" size={20} color={colors.mediumGray} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  userName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.body2.fontSize,
    color: colors.darkGray,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  roleText: {
    color: colors.white,
    fontSize: typography.caption.fontSize,
    fontWeight: "600" as "600",
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: "600" as "600",
    marginLeft: spacing.xs,
  },
  editForm: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  sectionContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.body1.fontSize,
    color: colors.text,
    marginLeft: spacing.md,
  },
  avatar: {
    marginBottom: spacing.md,
  },
});

export default ProfileScreen; 