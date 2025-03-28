import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../../navigation/types';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/Header';
import commonStyles from '../../utils/commonStyles';

// Import our modular components from the index file
import {
  ProfileHeader,
  RoleSpecificContent,
  AccountSettings,
  ProfileEditForm
} from '../../components/profile';

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Profile'>,
  BottomTabScreenProps<MainTabParamList, 'Profile'>
>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="My Profile" showBack={false} />
      
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
                navigation={navigation} 
              />
              
              {/* Account settings */}
              <AccountSettings navigation={navigation} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 