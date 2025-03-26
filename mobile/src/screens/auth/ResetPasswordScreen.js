import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, TextInput } from '../../components';
import { AuthService } from '../../api';

const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the token from the route params (this would come from the deep link)
  const { token } = route.params || {};
  
  useEffect(() => {
    // Validate that we have a token
    if (!token) {
      Alert.alert(
        "Invalid Link",
        "The password reset link is invalid or has expired. Please request a new one.",
        [{ text: "OK", onPress: () => navigation.navigate('ForgotPassword') }]
      );
    }
  }, [token, navigation]);

  const validateInputs = () => {
    let isValid = true;
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.resetPassword(token, password);
      Alert.alert(
        "Success",
        "Your password has been reset successfully.",
        [{ text: "Login", onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Create a new password for your account.
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        <TextInput
          label="New Password"
          placeholder="Enter your new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!passwordError}
          errorText={passwordError}
        />

        <TextInput
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={!!confirmPasswordError}
          errorText={confirmPasswordError}
          style={styles.inputSpacing}
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
          fullWidth
          style={styles.resetButton}
        />

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: SIZES.padding,
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
  },
  content: {
    padding: SIZES.padding,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20',
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  errorMessage: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
  },
  inputSpacing: {
    marginTop: 16,
  },
  resetButton: {
    marginTop: 32,
    marginBottom: 16,
  },
  loginButton: {
    alignSelf: 'center',
    padding: 8,
  },
  loginText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default ResetPasswordScreen; 