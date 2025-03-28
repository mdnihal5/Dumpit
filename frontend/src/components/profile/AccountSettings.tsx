import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../utils/theme';
import commonStyles from '../../utils/commonStyles';

interface SettingsItem {
  icon: string;
  label: string;
  screen: string;
}

interface AccountSettingsProps {
  navigation: any;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ navigation }) => {
  
  // Define settings items
  const settingsItems: SettingsItem[] = [
    { icon: 'lock', label: 'Change Password', screen: 'ChangePassword' },
    { icon: 'bell', label: 'Notification Settings', screen: 'Notifications' },
    { icon: 'log-out', label: 'Logout', screen: 'Logout' }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      
      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.listItem,
            index === settingsItems.length - 1 && styles.listItemLast
          ]}
          onPress={() => {
            if (item.screen === 'Logout') {
              // Handle logout differently if needed
              // For now, just navigate to the screen
            }
            navigation.navigate(item.screen);
          }}
        >
          <Feather name={item.icon as any} size={20} color={colors.text} />
          <Text style={[
            styles.listItemText,
            item.screen === 'Logout' && styles.logoutText
          ]}>
            {item.label}
          </Text>
          <Feather name="chevron-right" size={20} color={colors.mediumGray} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemText: {
    flex: 1,
    fontSize: typography.body1.fontSize,
    color: colors.text,
    marginLeft: spacing.md,
  },
  logoutText: {
    color: colors.error,
  }
});

export default AccountSettings; 