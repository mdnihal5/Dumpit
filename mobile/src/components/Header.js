import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

/**
 * Header component for screen headers
 * 
 * @param {Object} props
 * @param {string} props.title - Header title
 * @param {Function} props.onBack - Function to call when back button is pressed
 * @param {boolean} props.showBack - Whether to show the back button
 * @param {React.ReactNode} props.rightComponent - Component to display on the right
 * @param {Object} props.style - Additional style for the header container
 * @param {Object} props.titleStyle - Additional style for the title
 */
const Header = ({
  title,
  onBack,
  showBack = true,
  rightComponent,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {showBack && onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default Header; 