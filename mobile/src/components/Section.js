import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

/**
 * Section component for displaying content sections with a title and optional "See All" button
 * 
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Function} props.onSeeAll - Function to call when "See All" is pressed
 * @param {boolean} props.showSeeAll - Whether to show the "See All" button
 * @param {Object} props.style - Additional style for the section container
 * @param {React.ReactNode} props.children - Section content
 */
const Section = ({
  title,
  onSeeAll,
  showSeeAll = true,
  style,
  children,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAll: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default Section; 