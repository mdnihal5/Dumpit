import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../utils/theme';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { BRANDING } from '../../utils/constants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(false);
  
  const validateForm = () => {
    // Reset previous errors
    setEmailError('');
    setPasswordError('');
    
    // Validate using Zod schema
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      // Format errors from Zod
      const formattedErrors = result.error.format();
      
      if (formattedErrors.email?._errors?.length) {
        setEmailError(formattedErrors.email._errors[0]);
      }
      
      if (formattedErrors.password?._errors?.length) {
        setPasswordError(formattedErrors.password._errors[0]);
      }
      
      return false;
    }
    
    return true;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setLoginAttempt(true);
        // Directly pass email and password to login function
        console.log('Attempting login with:', { email, password: '******' });
        const success = await login(email, password);
        
        if (!success) {
          Alert.alert('Login Failed', 'Please check your credentials and try again.');
        }
      } catch (error: any) {
        const errorMsg = error?.message || 'An unexpected error occurred. Please try again later.';
        console.error('Login error:', errorMsg);
        Alert.alert('Error', errorMsg);
      } finally {
        setLoginAttempt(false);
      }
    }
  };
  
  // Use local loading state to ensure button shows loading indicator
  const buttonLoading = isLoading && loginAttempt;
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to {BRANDING.APP_NAME}!</Text>
            <Text style={styles.subtitleText}>
              {BRANDING.TAGLINE}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
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
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            
            <Button
              variant="primary"
              title="Sign In"
              onPress={handleLogin}
              loading={buttonLoading}
              style={styles.button}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign up</Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as any,
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as any,
    lineHeight: typography.body1.lineHeight,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as any,
    lineHeight: typography.body2.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as any,
    lineHeight: typography.body1.lineHeight,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as any,
    lineHeight: typography.body2.lineHeight,
    color: colors.primary,
  },
  button: {
    marginBottom: spacing.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as any,
    lineHeight: typography.body2.lineHeight,
    color: colors.darkGray,
  },
  registerLink: {
    fontSize: typography.body2.fontSize,
    fontWeight: "700" as any,
    lineHeight: typography.body2.lineHeight,
    color: colors.primary,
  },
});

export default LoginScreen; 