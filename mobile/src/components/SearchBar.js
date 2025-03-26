import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

/**
 * SearchBar component for searching products and vendors
 * 
 * @param {Object} props
 * @param {string} props.value - Search text value
 * @param {Function} props.onChangeText - Function to call when text changes
 * @param {Function} props.onSubmit - Function to call when search is submitted
 * @param {Function} props.onFilter - Function to call when filter button is pressed
 * @param {boolean} props.showFilter - Whether to show filter button
 * @param {Object} props.style - Additional style for the search bar container
 */
const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  onFilter,
  showFilter = true,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search construction materials"
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          {...props}
        />
        {value ? (
          <TouchableOpacity 
            onPress={() => onChangeText && onChangeText('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      {showFilter && (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onFilter}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginVertical: SIZES.margin,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.textSecondary,
  },
  input: {
    ...TYPOGRAPHY.body,
    flex: 1,
    height: 44,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textTertiary,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
});

export default SearchBar; 