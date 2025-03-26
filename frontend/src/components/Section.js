import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, SPACING } from '../styles';

/**
 * Section component for grouping content with a header
 * @param {object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Content to render inside the section
 * @param {Function} props.onSeeAllPress - Function to execute when "See All" is pressed
 * @param {object} props.style - Additional style for the container
 * @param {object} props.titleStyle - Additional style for the title
 * @param {boolean} props.showSeeAll - Whether to show the "See All" button
 */
const Section = ({
  title,
  children,
  onSeeAllPress,
  style,
  titleStyle,
  showSeeAll = true
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        
        {showSeeAll && onSeeAllPress && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={onSeeAllPress}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Feather name="chevron-right" size={16} color={Colors.PRIMARY} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LARGE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
  },
  title: {
    ...Typography.TYPOGRAPHY.H3,
    color: Colors.TEXT.PRIMARY,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.PRIMARY,
    marginRight: SPACING.TINY,
  },
  content: {
    
  },
});

export default Section; 