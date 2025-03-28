import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../utils/theme';
import { authService } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { passwordChangeSchema } from '../../utils/validation';

type Props = NativeStackScreenProps<MainStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Error state
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    // Reset all errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    // Validate using schema
    try {
      passwordChangeSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return true;
    } catch (error: any) {
      const formattedErrors = error.format();
      
      if (formattedErrors.currentPassword?._errors?.length) {
        setCurrentPasswordError(formattedErrors.currentPassword._errors[0]);
      }
      
      if (formattedErrors.newPassword?._errors?.length) {
        setNewPasswordError(formattedErrors.newPassword._errors[0]);
      }
      
      if (formattedErrors.confirmPassword?._errors?.length) {
        setConfirmPasswordError(formattedErrors.confirmPassword._errors[0]);
      }
      
      return false;
    }
  };

  // Handle form submission
  const handleChangePassword = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      
      Alert.alert('Success', 'Your password has been updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 401) {
        setCurrentPasswordError('Current password is incorrect');
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again later.');
      }
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change Password" showBack={true} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.description}>
              Create a new password for your account. Your password should be at least 8 characters long and include a mix of letters, numbers, and symbols.
            </Text>
            
            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              error={currentPasswordError}
              leftIcon={<Feather name="lock" size={20} color={colors.mediumGray} />}
              autoCapitalize="none"
            />
            
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              error={newPasswordError}
              leftIcon={<Feather name="key" size={20} color={colors.mediumGray} />}
              autoCapitalize="none"
            />
            
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
              leftIcon={<Feather name="check-circle" size={20} color={colors.mediumGray} />}
              autoCapitalize="none"
            />
            
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirementItem}>• At least 8 characters long</Text>
              <Text style={styles.requirementItem}>• Include at least one uppercase letter</Text>
              <Text style={styles.requirementItem}>• Include at least one number</Text>
              <Text style={styles.requirementItem}>• Include at least one special character</Text>
            </View>
            
            <Button
              title="Update Password"
              onPress={handleChangePassword}
              loading={isLoading}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: spacing.lg,
  },
  description: {
    ...typography.body2,
    color: colors.darkGray,
    marginBottom: spacing.xl,
  } as TextStyle,
  passwordRequirements: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  requirementsTitle: {
    ...typography.body2,
    fontWeight: '600' as '600',
    color: colors.text,
    marginBottom: spacing.sm,
  } as TextStyle,
  requirementItem: {
    ...typography.body2,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  } as TextStyle,
  button: {
    marginTop: spacing.lg,
  },
});

export default ChangePasswordScreen; 