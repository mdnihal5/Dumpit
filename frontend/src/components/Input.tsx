import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors, typography } from '../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(({ 
  label, 
  error, 
  containerStyle, 
  style, 
  leftIcon, 
  disabled,
  onChangeText,
  value,
  ...props 
}, ref) => {
  
  // Use the value prop directly and pass onChangeText correctly to avoid re-render issues
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error ? styles.inputError : null,
            leftIcon ? styles.inputWithIcon : null,
            disabled ? styles.inputDisabled : null,
            style,
          ] as StyleProp<TextStyle>}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          onChangeText={onChangeText} // Directly pass the onChangeText
          value={value} // Directly bind the value prop
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.body2,
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    ...typography.body1,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.grey[100],
    opacity: 0.7,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
});

export default Input;
