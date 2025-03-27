import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../utils/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token } = route.params;
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      const success = await resetPassword(password, token);
      
      if (success) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.titleText}>Reset Password</Text>
              <Text style={styles.subtitleText}>
                {isSuccess
                  ? 'Your password has been reset successfully.'
                  : 'Create a new password for your account.'}
              </Text>
            </View>
            
            {/* Form */}
            {!isSuccess ? (
              <View style={styles.form}>
                <Input
                  label="New Password"
                  placeholder="Enter your new password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                  autoComplete="password-new"
                />
                
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  error={errors.confirmPassword}
                  autoComplete="password-new"
                />
                
                <Button
                  title="Reset Password"
                  onPress={handleResetPassword}
                  loading={isLoading}
                  fullWidth
                  style={styles.resetButton}
                />
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Button
                  title="Go to Login"
                  onPress={() => navigation.navigate('Login')}
                  fullWidth
                  style={styles.loginButton}
                />
              </View>
            )}
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
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  titleText: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitleText: {
    fontSize: typography.fontSizes.md,
    color: colors.darkGray,
    lineHeight: typography.lineHeights.md,
  },
  form: {
    marginBottom: spacing.xl,
  },
  resetButton: {
    marginTop: spacing.lg,
  },
  successContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
});

export default ResetPasswordScreen; 