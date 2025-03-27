import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Menu, Divider } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import useAuth from '../hooks/useAuth';
import { MainScreenNavigationProp } from '../types/navigation';

// Props interface
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showProfile = true,
}) => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle profile press
  const handleProfilePress = () => {
    setMenuVisible(true);
  };

  // Handle navigation to profile screen
  const navigateToProfile = () => {
    setMenuVisible(false);
    navigation.navigate('Profile');
  };

  // Handle navigation to settings screen
  const navigateToSettings = () => {
    setMenuVisible(false);
    navigation.navigate('Settings');
  };

  // Handle logout
  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
  };

  // Get initials from user name
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            {showBack && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            {title && <Text style={styles.title}>{title}</Text>}
          </View>

          {showProfile && user && (
            <View style={styles.rightContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
                    <Avatar.Text 
                      size={40} 
                      label={getUserInitials()} 
                      style={{ backgroundColor: colors.primary }}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
              >
                <View style={styles.menuHeader}>
                  <Avatar.Text 
                    size={50} 
                    label={getUserInitials()} 
                    style={{ backgroundColor: colors.primary }}
                    color={colors.white}
                  />
                  <View style={styles.menuHeaderTextContainer}>
                    <Text style={styles.menuHeaderName}>{user.name}</Text>
                    <Text style={styles.menuHeaderEmail}>{user.email}</Text>
                  </View>
                </View>
                <Divider />
                <Menu.Item
                  onPress={navigateToProfile}
                  title="My Profile"
                  leadingIcon="account"
                />
                <Menu.Item
                  onPress={navigateToSettings}
                  title="Settings"
                  leadingIcon="cog"
                />
                <Divider />
                <Menu.Item
                  onPress={handleLogout}
                  title="Logout"
                  leadingIcon="logout"
                />
              </Menu>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    ...shadows.sm,
    zIndex: 10,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.h3.lineHeight,
    color: colors.text,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: spacing.xs,
  },
  menuContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginTop: Platform.OS === 'android' ? -spacing.md : 0,
    width: 250,
    ...shadows.md,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuHeaderTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  menuHeaderName: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.body1.lineHeight,
    color: colors.text,
  },
  menuHeaderEmail: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.body2.lineHeight,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
});

export default Header; 