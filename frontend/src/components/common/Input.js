import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, BORDER_RADIUS, SPACING } from '../../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  icon,
  onIconPress,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          multiline && styles.multilineInput,
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={SIZES.medium}
            color={error ? COLORS.error : COLORS.text.light}
            style={styles.icon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.light}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineTextInput,
            inputStyle,
          ]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
            <Icon
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={SIZES.medium}
              color={COLORS.text.light}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginLeft: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  multilineTextInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  iconButton: {
    padding: SPACING.sm,
  },
  errorText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input; 