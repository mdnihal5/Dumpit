import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, TextInput } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Show alert if there's an error from Redux
    if (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong, please try again.');
    }
  }, [error]);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await dispatch(login({ email, password })).unwrap();
      // No need to navigate, AppNavigator will handle it based on auth state
    } catch (err) {
      // Error is handled by the error useEffect above
      console.log('Login error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.logo}>DumpIt</Text>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
              }
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
              }
            />

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'android' ? SIZES.padding * 2 : SIZES.padding,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  logo: {
    ...TYPOGRAPHY.heading,
    fontSize: 36,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  welcomeText: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  formContainer: {
    marginTop: SIZES.padding,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.padding * 2,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  loginButton: {
    marginTop: SIZES.padding,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding * 3,
    marginBottom: SIZES.padding,
  },
  signupText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  signupButton: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen; 