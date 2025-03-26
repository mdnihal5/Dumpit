import React, { useState } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { TextInput, Button, Divider } from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import authService from '../../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Login successful, navigation will be handled by auth state listener
      } else {
        Alert.alert('Login Failed', response.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Feather name="mail" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              leftIcon={<Feather name="lock" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordLink}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
            />

            <Divider text="Or continue with" />

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Feather name="facebook" size={20} color={Colors.PRIMARY} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Feather name="github" size={20} color={Colors.PRIMARY} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.LARGE,
  },
  header: {
    marginBottom: SPACING.XLARGE,
    alignItems: 'center',
  },
  title: {
    ...Typography.TYPOGRAPHY.H2,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    textAlign: 'center',
    marginBottom: SPACING.SMALL,
  },
  subtitle: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.XLARGE,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.LARGE,
  },
  forgotPasswordText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.PRIMARY,
  },
  loginButton: {
    marginBottom: SPACING.LARGE,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.MEDIUM,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: Colors.BORDER.LIGHT,
    borderRadius: 8,
    flex: 0.48,
  },
  socialButtonText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.PRIMARY,
    marginLeft: SPACING.SMALL,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.MEDIUM,
  },
  footerText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
  },
  signupLink: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
});

export default LoginScreen; 