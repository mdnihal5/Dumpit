import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextStyle,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { getUserAvatar, createImageFormData } from '../../utils/assetUtils';
import { userService } from '../../services/api';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';

interface ProfileHeaderProps {
  user: any;
  onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [avatarSource, setAvatarSource] = useState<string | null>(user?.avatar || null);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    try {
      // Request permission to access the image library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to grant permission to access your photo library');
        return;
      }
      
      // Launch the image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (pickerResult.canceled) {
        return;
      }
      
      // Set uploading state
      setUploading(true);
      
      // Create a form data object using the utility function
      const uri = pickerResult.assets[0].uri;
      const formData = createImageFormData(uri);
      
      // Upload the image
      try {
        const response = await userService.updateAvatar(formData);
        if (response.data.success) {
          const newAvatarPath = response.data.data.avatar;
          setAvatarSource(newAvatarPath);
          
          // Update the user in Redux state
          dispatch(updateUserProfile({ avatar: newAvatarPath }));
          
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.');
      } finally {
        setUploading(false);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image');
      setUploading(false);
    }
  };

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={handleAvatarUpload} disabled={uploading}>
        {user?.avatar || avatarSource ? (
          <Avatar.Image
            size={80}
            source={getUserAvatar(avatarSource || user?.avatar || '')}
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
        {uploading ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.uploadIndicator} />
        ) : (
          <View style={styles.editAvatarButton}>
            <Feather name="camera" size={14} color={colors.white} />
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.editButton}
        onPress={onEditPress}
      >
        <Feather name="edit" size={18} color={colors.white} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: '700' as TextStyle['fontWeight'],
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
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600' as TextStyle['fontWeight'],
    marginLeft: spacing.xs,
  },
  avatar: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  uploadIndicator: {
    position: 'absolute',
    bottom: spacing.xs,
    right: 0,
  },
});

export default ProfileHeader; 