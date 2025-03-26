import React, { useState } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const validate = () => {
    let newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (response.success) {
        // Registration successful, navigate to verification or home
        Alert.alert(
          'Registration Successful', 
          'Your account has been created successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Navigation will be handled by auth state listener
              }
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', response.message || 'Please check your information and try again.');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              error={errors.fullName}
              leftIcon={<Feather name="user" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Feather name="mail" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TextInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              keyboardType="phone-pad"
              error={errors.phone}
              leftIcon={<Feather name="phone" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TextInput
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              error={errors.password}
              leftIcon={<Feather name="lock" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon={<Feather name="lock" size={20} color={Colors.TEXT.SECONDARY} />}
            />

            <Button
              title="Sign Up"
              onPress={handleRegister}
              style={styles.registerButton}
              loading={loading}
              disabled={loading}
            />

            <Divider text="Or sign up with" />

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
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: SPACING.LARGE,
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
    marginBottom: SPACING.LARGE,
  },
  registerButton: {
    marginVertical: SPACING.LARGE,
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
  loginLink: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
});

export default RegisterScreen; 