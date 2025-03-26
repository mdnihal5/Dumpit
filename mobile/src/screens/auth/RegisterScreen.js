import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, TextInput } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validateInputs = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      setPhoneError('Please enter a valid 10-digit phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    const userData = {
      name,
      email,
      phone,
      password,
    };

    try {
      await dispatch(register(userData)).unwrap();
      // If successful, navigate to login screen
      navigation.navigate('Login');
    } catch (error) {
      // Error is handled by the redux state
      console.log('Registration error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>
                {error.message || 'Registration failed. Please try again.'}
              </Text>
            </View>
          )}

          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={!!nameError}
            errorText={nameError}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            errorText={emailError}
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={!!phoneError}
            errorText={phoneError}
          />

          <TextInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={!!passwordError}
            errorText={passwordError}
          />

          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={!!confirmPasswordError}
            errorText={confirmPasswordError}
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
  },
  formContainer: {
    width: '100%',
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
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loginText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default RegisterScreen; 