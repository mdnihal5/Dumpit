import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Colors, Typography, SPACING, SHADOWS } from '../styles';

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  titleStyle,
  showShadow = true,
  backgroundColor = Colors.BACKGROUND.PRIMARY,
  ...props
}) => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor },
      showShadow && styles.shadow,
      style
    ]} {...props}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle="dark-content"
      />
      
      <View style={styles.headerContent}>
        {/* Left side (usually back button) */}
        {leftIcon ? (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={onLeftPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : <View style={styles.placeholderButton} />}
        
        {/* Title */}
        {title && (
          <Text 
            style={[styles.title, titleStyle]} 
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        
        {/* Right side (optional button) */}
        {rightIcon ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : <View style={styles.placeholderButton} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  shadow: {
    ...SHADOWS.SMALL,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.MEDIUM,
  },
  title: {
    ...Typography.TYPOGRAPHY.H4,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    color: Colors.TEXT.PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  leftButton: {
    padding: SPACING.SMALL,
    marginLeft: -SPACING.SMALL,
  },
  rightButton: {
    padding: SPACING.SMALL,
    marginRight: -SPACING.SMALL,
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
});

export default Header; 