import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, TextStyle, Image} from 'react-native'
import {Feather} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import {API_URL} from '@env'
import {colors, spacing, typography, borderRadius} from '../../utils/theme'
import {userService} from '../../services/api'
import {useDispatch} from 'react-redux'
import {updateUserProfile} from '../../store/slices/authSlice'

interface ProfileHeaderProps {
  user: any
  onEditPress: () => void
}

const createImageFormData = (uri: string, fileName: string) => {
  const filename = fileName
  // This extracts the file extension (.jpg, .png, etc.)
  const match = /\.(\w+)$/.exec(filename)
  const type = match ? `image/${match[1]}` : 'image/jpeg'

  const formData = new FormData()
  formData.append('avatar', {
    uri,
    name: filename,
    type,
  } as any)

  console.log('Form data created:', {filename, type})
  return formData
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({user, onEditPress}) => {
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)
  const [avatarSource, setAvatarSource] = useState<string | null>(null)

  useEffect(() => {
    if (user?.avatar) {
      setAvatarSource(user.avatar)
    }
  }, [user])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Format avatar URL
  const getAvatarUri = (path: string) => {
    if (!path) return null
    return
    if (path.startsWith('http')) {
      return path
    }

    // Add base URL for relative paths
    const fullUrl = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
    console.log('Avatar URL:', fullUrl)
    return fullUrl
  }

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    try {
      // Request permission to access the image library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to grant permission to access your photo library')
        return
      }

      // Launch the image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (pickerResult.canceled) {
        return
      }

      // Set uploading state
      setUploading(true)

      // Create a form data object
      const uri = pickerResult.assets[0].uri
      const fileName = pickerResult.assets[0].fileName || 'photo.jpg'
      const formData = createImageFormData(uri, fileName)

      console.log('Uploading avatar...', formData)

      // Upload the image
      try {
        const response = await userService.uploadAvatar(formData)
        console.log('Upload response:', response.data)

        if (response.data && response.data.success) {
          const newAvatarPath = response.data.data.avatar
          setAvatarSource(newAvatarPath)

          // Update the user in Redux state
          dispatch(updateUserProfile({avatar: newAvatarPath}))

          Alert.alert('Success', 'Profile picture updated successfully')
        } else {
          throw new Error(response.data?.message || 'Upload failed')
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
        Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.')
      } finally {
        setUploading(false)
      }
    } catch (error) {
      console.error('Error selecting image:', error)
      Alert.alert('Error', 'An error occurred while selecting the image')
      setUploading(false)
    }
  }

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={handleAvatarUpload} disabled={uploading}>
        {avatarSource ? (
          <Image
            source={{uri: getAvatarUri(avatarSource) || undefined}}
            style={styles.avatar}
            defaultSource={require('../../assets/images/default-avatar.png')}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
        )}
        {uploading ? (
          <ActivityIndicator size='small' color={colors.primary} style={styles.uploadIndicator} />
        ) : (
          <View style={styles.editAvatarButton}>
            <Feather name='camera' size={14} color={colors.white} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Feather name='edit' size={18} color={colors.white} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
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
    bottom: 0,
    right: 0,
  },
})

export default ProfileHeader
