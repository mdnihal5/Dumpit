import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../styles';

const TextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'done',
  maxLength,
  style,
  inputStyle,
  labelStyle,
  isRequired = false,
  onBlur,
  onFocus,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const passwordIcon = isPasswordVisible ? 
    (<TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      <Text style={styles.passwordToggleText}>Hide</Text>
    </TouchableOpacity>) : 
    (<TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      <Text style={styles.passwordToggleText}>Show</Text>
    </TouchableOpacity>);

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return passwordIcon;
    }
    return rightIcon ? (
      <TouchableOpacity
        onPress={onRightIconPress}
        disabled={!onRightIconPress}
        style={styles.iconContainer}
      >
        {rightIcon}
      </TouchableOpacity>
    ) : null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {isRequired && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
          multiline && styles.multiline,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.TEXT.SECONDARY}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {renderRightIcon()}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.XSMALL,
  },
  label: {
    ...Typography.TYPOGRAPHY.LABEL,
    color: Colors.TEXT.PRIMARY,
  },
  required: {
    color: Colors.DANGER,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER.DEFAULT,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    minHeight: 48,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
    paddingTop: SPACING.MEDIUM,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.XSMALL,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.XSMALL,
  },
  iconContainer: {
    padding: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIconContainer: {
    marginLeft: SPACING.MEDIUM,
  },
  focused: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.DANGER,
  },
  disabled: {
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    borderColor: Colors.BORDER.LIGHT,
  },
  multiline: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  helperText: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    marginTop: SPACING.XSMALL,
  },
  errorText: {
    color: Colors.DANGER,
  },
  passwordToggleText: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.PRIMARY,
  },
});

export default TextInput; 