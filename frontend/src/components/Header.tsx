import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../utils/theme';
import useAuth from '../hooks/useAuth';
import { MainScreenNavigationProp } from '../types/navigation';

// Props interface
export interface HeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showProfile = true,
  onBackPress,
  rightIcon,
}) => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { user } = useAuth();

  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Handle profile press
  const handleProfilePress = () => {
    navigation.navigate('Profile');
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
            <Text style={styles.title}>{title}</Text>
          </View>

          {rightIcon && (
            <View style={styles.rightContainer}>
              {rightIcon}
            </View>
          )}

          {showProfile && user && (
            <View style={styles.rightContainer}>
              <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
                <Avatar.Text 
                  size={40} 
                  label={getUserInitials()} 
                  style={{ backgroundColor: colors.primary }}
                  color={colors.white}
                />
              </TouchableOpacity>
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
  } as TextStyle,
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: spacing.xs,
  }
});

export default Header; 