import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../utils/theme';
import Header from '../components/Header';
import { notificationService } from '../api/services';

// Types for notification settings
interface NotificationSettings {
  orderUpdates: boolean;
  stockAlerts: boolean;
  passwordChanges: boolean;
  marketing: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

type Props = NativeStackScreenProps<MainStackParamList, 'NotificationSettings'>;

const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  // States
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    stockAlerts: true,
    passwordChanges: true,
    marketing: true,
    emailNotifications: true,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch notification settings on mount
  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  // Get notification settings from API
  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getSettings();
      if (response.data && response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      Alert.alert(
        'Error',
        'Failed to load notification settings. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle notification setting
  const toggleSetting = (setting: keyof NotificationSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };

  // Save all settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await notificationService.updateSettings(settings);
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Your notification settings have been updated.');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert(
        'Error',
        'Failed to update notification settings. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            const defaultSettings: NotificationSettings = {
              orderUpdates: true,
              stockAlerts: true,
              passwordChanges: true,
              marketing: true,
              emailNotifications: true,
              pushNotifications: true,
            };
            setSettings(defaultSettings);
          }
        }
      ]
    );
  };

  // Render setting item
  const renderSettingItem = (
    title: string,
    description: string,
    key: keyof NotificationSettings,
    icon: string
  ) => (
    <>
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Feather name={icon as any} size={22} color={colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          value={settings[key]}
          onValueChange={() => toggleSetting(key)}
          trackColor={{ false: colors.lightGray, true: colors.primary + '80' }}
          thumbColor={settings[key] ? colors.primary : colors.white}
        />
      </View>
      <View style={styles.settingSeparator} />
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Notification Settings" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Notification Settings" 
        showBack={true} 
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'Order Updates',
              'Receive notifications about your orders',
              'orderUpdates',
              'package'
            )}
            
            {renderSettingItem(
              'Stock Alerts',
              'Get alerts when your favorite items are back in stock',
              'stockAlerts',
              'box'
            )}
            
            {renderSettingItem(
              'Password Changes',
              'Get notified about password and security changes',
              'passwordChanges',
              'lock'
            )}
            
            {renderSettingItem(
              'Marketing & Promotions',
              'Receive updates about sales and special offers',
              'marketing',
              'tag'
            )}
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'Email Notifications',
              'Receive notifications via email',
              'emailNotifications',
              'mail'
            )}
            
            {renderSettingItem(
              'Push Notifications',
              'Receive push notifications on your device',
              'pushNotifications',
              'bell'
            )}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetToDefaults}
          >
            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveSettings}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Settings</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  } as TextStyle,
  settingsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    ...shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.body1,
    fontWeight: '600' as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  } as TextStyle,
  settingDescription: {
    ...typography.body2,
    color: colors.darkGray,
  } as TextStyle,
  settingSeparator: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  resetButton: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.primary,
    ...typography.button,
    fontWeight: '600' as '600',
  } as TextStyle,
  saveButton: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flex: 1,
    marginLeft: spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    ...typography.button,
    fontWeight: '600' as '600',
  } as TextStyle,
});

export default NotificationSettingsScreen; 