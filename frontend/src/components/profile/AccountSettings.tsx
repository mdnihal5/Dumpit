import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../theme';
import { AppDispatch } from '../../store';

interface SettingsItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screen: string;
}

interface AccountSettingsProps {
  onClose?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const settingsItems: SettingsItem[] = [
    { icon: 'key', label: 'Change Password', screen: 'ChangePassword' },
    { icon: 'bell', label: 'Notification Settings', screen: 'NotificationSettings' },
    { icon: 'log-out', label: 'Logout', screen: 'Logout' }
  ];

  const handleSettingPress = async (item: SettingsItem) => {
    if (item.screen === 'Logout') {
      
            try {
              await dispatch(logout());
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          
    } else {
      // @ts-ignore
      navigation.navigate(item.screen);
      if (onClose) onClose();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Settings</Text>
      
      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.settingItem}
          onPress={() => handleSettingPress(item)}
        >
          <View style={styles.settingContent}>
            <Feather name={item.icon} size={22} color={colors.primary} style={styles.icon} />
            <Text style={[
              styles.settingText,
              item.screen === 'Logout' && styles.logoutText
            ]}>
              {item.label}
            </Text>
          </View>
          {item.screen !== 'Logout' && (
            <Feather name="chevron-right" size={22} color={colors.darkGray} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutText: {
    color: colors.error,
  },
});

export default AccountSettings; 