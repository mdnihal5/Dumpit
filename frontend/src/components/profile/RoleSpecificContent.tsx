import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';

interface NavigationItem {
  icon: string;
  label: string;
  screen: string;
}

interface RoleSpecificContentProps {
  role?: string;
}

const RoleSpecificContent: React.FC<RoleSpecificContentProps> = ({ role }) => {
  const navigation = useNavigation();
  
  // Define navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    switch (role) {
      case 'vendor':
        return [
          { icon: 'box', label: 'Product Management', screen: 'ProductManagement' },
          { icon: 'shopping-bag', label: 'Order Management', screen: 'OrderManagement' },
          { icon: 'bar-chart-2', label: 'Sales Reports', screen: 'Reports' }
        ];
        
      case 'admin':
        return [
          { icon: 'users', label: 'User Management', screen: 'UserManagement' },
          { icon: 'briefcase', label: 'Vendor Management', screen: 'VendorManagement' },
          { icon: 'list', label: 'Category Management', screen: 'CategoryManagement' }
        ];
        
      default: // Regular user
        return [
          { icon: 'map-pin', label: 'Saved Addresses', screen: 'SavedAddresses' }
        ];
    }
  };
  
  // Get section title based on user role
  const getSectionTitle = (): string => {
    switch (role) {
      case 'vendor':
        return 'Vendor Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'My Activities';
    }
  };
  
  const navigationItems = getNavigationItems();
  
  if (!role) return null;

  const handleNavigation = (screen: string) => {
    // @ts-ignore - We know these screens exist in our navigation
    navigation.navigate(screen);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
      
      {navigationItems.map((item, index) => (
        <TouchableOpacity 
          key={index}
          style={[
            styles.listItem,
            index === navigationItems.length - 1 && styles.listItemLast
          ]}
          activeOpacity={0.6}
          onPress={() => handleNavigation(item.screen)}
        >
          <Feather name={item.icon as any} size={20} color={colors.text} />
          <Text style={styles.listItemText}>{item.label}</Text>
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
});

export default RoleSpecificContent; 