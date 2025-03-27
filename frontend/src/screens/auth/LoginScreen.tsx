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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../../types/navigation';

import { Feather } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../utils/theme';
import { loginSchema } from '../../utils/validation';
import useAuth from '../../hooks/useAuth';
import { BRANDING } from '../../utils/constants';

const LoginScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  
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
        const result = await login({
          email,
          password
        });
        
        if (!result.success) {
          Alert.alert('Login Failed', result.error || 'Please check your credentials and try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };
  
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
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Feather name="mail" size={20} color={colors.mediumGray} />}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry={!showPassword}
              leftIcon={<Feather name="lock" size={20} color={colors.mediumGray} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.mediumGray}
                  />
                </TouchableOpacity>
              }
            />
            
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
              loading={isLoading}
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
    fontWeight: typography.h1.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.body1.lineHeight,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
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
    fontWeight: typography.body2.fontWeight as "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
    lineHeight: typography.body2.lineHeight,
    color: colors.darkGray,
  },
  registerLink: {
    fontSize: typography.body2.fontSize,
    fontWeight: "bold" as "bold",
    lineHeight: typography.body2.lineHeight,
    color: colors.primary,
  },
});

export default LoginScreen; 