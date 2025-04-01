import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/Header';
import commonStyles from '../../utils/commonStyles';
import { colors } from '../../utils/theme';
import { userService } from '../../services/api';

// Import our modular components from the index file
import {
  ProfileHeader,
  RoleSpecificContent,
  AccountSettings,
  ProfileEditForm
} from '../../components/profile';

// Use stack navigation props only
type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState(authUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Also update local user state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getProfile();
      
      if (response.data && response.data.success) {
        setUser(response.data.data);
        console.log('User profile data:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
      // Fall back to auth user data if API fails
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Header title="My Profile" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="My Profile" showBack={true} onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isEditing ? (
            <ProfileEditForm 
              user={user} 
              onCancel={() => setIsEditing(false)} 
              onSuccess={() => {
                setIsEditing(false);
                fetchUserProfile(); // Reload profile data after edit
              }}
            />
          ) : (
            <>
              <ProfileHeader 
                user={user} 
                onEditPress={() => setIsEditing(true)} 
              />
              
              {/* Role-specific content */}
              <RoleSpecificContent 
                role={user?.role} 
              />
              
              {/* Account settings */}
              <AccountSettings />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 