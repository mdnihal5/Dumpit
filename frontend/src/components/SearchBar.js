import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Text
} from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS, SHADOWS } from '../styles';

const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Search for products or vendors...',
  style,
  iconLeft,
  iconRight,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Left icon (usually search icon) */}
      {iconLeft && (
        <View style={styles.iconLeft}>
          {iconLeft}
        </View>
      )}
      
      {/* Search input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT.SECONDARY}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...props}
      />
      
      {/* Clear button when there's text */}
      {value && value.length > 0 && onClear && (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}
      
      {/* Right icon (usually filter icon) */}
      {iconRight && (
        <View style={styles.iconRight}>
          {iconRight}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: Colors.BORDER.LIGHT,
    paddingHorizontal: SPACING.MEDIUM,
    height: 48,
    ...SHADOWS.SMALL,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
  },
  iconLeft: {
    marginRight: SPACING.SMALL,
  },
  iconRight: {
    marginLeft: SPACING.SMALL,
  },
  clearButton: {
    padding: SPACING.TINY,
  },
  clearButtonText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
});

export default SearchBar; 