import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  Text
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows, typography, spacing, borderRadius } from '../utils/theme';

// Icon mapping for tab routes
const ICON_MAPPING: Record<string, string> = {
  Home: 'home',
  Cart: 'cart',
  Orders: 'package-variant',
  Profile: 'account',
  Notifications: 'bell',
};

const ModernBottomNavigation: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const tabWidth = width / state.routes.length;
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + Math.max(insets.bottom, 8),
        }
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;
        
        const iconName = ICON_MAPPING[route.name] || 'help-circle';
        
        // Handle tab press
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={[
              styles.tabItem,
              { width: tabWidth }
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Icon 
                name={iconName} 
                size={24} 
                color={isFocused ? colors.primary : colors.mediumGray} 
              />
              <Text 
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.primary : colors.mediumGray }
                ]}
              >
                {label.toString()}
              </Text>
              {isFocused && <View style={styles.indicator} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...shadows.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: typography.fontSizes.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    top: -18,
    height: 3,
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  }
});

export default ModernBottomNavigation; 