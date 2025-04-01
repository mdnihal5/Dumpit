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
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import useAuth from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../utils/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      const success = await forgotPassword(email);
      
      if (success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.titleText}>Forgot Password</Text>
              <Text style={styles.subtitleText}>
                {isSubmitted 
                  ? "We've sent a password reset link to your email address."
                  : "Enter your email and we'll send you a link to reset your password."}
              </Text>
            </View>
            
            {/* Form */}
            {!isSubmitted ? (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                
                <Button
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  loading={isLoading}
                  fullWidth
                  style={styles.submitButton}
                />
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Button
                  title="Back to Login"
                  onPress={() => navigation.navigate('Login')}
                  variant="outline"
                  fullWidth
                  style={styles.backToLoginButton}
                />
              </View>
            )}
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButtonText: {
    fontSize: typography.fontSizes.md,
    color: colors.primary,
    fontWeight: '500' as const,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as any,
    lineHeight: typography.body2.lineHeight,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as any,
    lineHeight: typography.body1.lineHeight,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  successContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  backToLoginButton: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacing.md,
  },
  footerText: {
    color: colors.darkGray,
    fontSize: typography.fontSizes.md,
    marginRight: spacing.xs,
  },
  loginLink: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: '500' as const,
  },
});

export default ForgotPasswordScreen; 