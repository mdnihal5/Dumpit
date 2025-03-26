import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

/**
 * Custom TextInput component
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {function} props.onChangeText - Function to call when text changes
 * @param {boolean} props.secureTextEntry - Whether to hide text (for passwords)
 * @param {string} props.error - Whether the input has an error
 * @param {string} props.errorText - Error message to display
 * @param {Object} props.style - Additional style for the input container
 * @param {Object} props.inputStyle - Additional style for the input field
 * @param {string} props.keyboardType - Keyboard type for the input
 * @param {string} props.autoCapitalize - Auto capitalize option for the input
 * @param {boolean} props.autoCorrect - Auto correct option for the input
 * @param {boolean} props.multiline - Whether the input is multiline
 * @param {number} props.numberOfLines - Number of lines for multiline input
 * @param {Object} props.leftIcon - Left icon component
 * @param {Object} props.rightIcon - Right icon component
 * @param {function} props.onRightIconPress - Function to call when right icon is pressed
 * @param {function} props.onLeftIconPress - Function to call when left icon is pressed
 * @param {Object} props.labelStyle - Additional style for the label
 * @param {number} props.maxLength - Maximum length for the input
 */
const TextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  style,
  inputStyle,
  labelStyle,
  maxLength,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const getContainerStyle = () => {
    return [
      styles.container,
      isFocused && styles.focusedContainer,
      error && styles.errorContainer,
      style
    ];
  };

  return (
    <View style={styles.inputWrapper}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <TouchableOpacity 
            style={styles.leftIconContainer} 
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
        
        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: 8,
  },
  container: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  focusedContainer: {
    borderColor: COLORS.primary,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  input: {
    ...TYPOGRAPHY.body,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIconContainer: {
    paddingHorizontal: 12,
  },
  rightIconContainer: {
    paddingHorizontal: 12,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    marginTop: 4,
  },
});

export default TextInput; 