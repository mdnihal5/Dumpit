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

import { TextInput, Button, Header } from '../../components';
import { Colors, Typography, SPACING } from '../../styles';
import authService from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
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
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSent(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Forgot Password"
        leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!sent ? (
            <>
              <View style={styles.iconContainer}>
                <Feather name="lock" size={60} color={Colors.PRIMARY} />
              </View>
              
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.form}>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error}
                  leftIcon={<Feather name="mail" size={20} color={Colors.TEXT.SECONDARY} />}
                />

                <Button
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  loading={loading}
                  disabled={loading}
                />
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.iconContainer}>
                <Feather name="check-circle" size={60} color={Colors.SUCCESS} />
              </View>
              
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
              </Text>
              
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}
              />
              
              <TouchableOpacity 
                style={styles.resendLink}
                onPress={handleSubmit}
              >
                <Text style={styles.resendText}>Didn't receive the email? Resend</Text>
              </TouchableOpacity>
            </View>
          )}
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
  iconContainer: {
    alignItems: 'center',
    marginVertical: SPACING.LARGE,
  },
  title: {
    ...Typography.TYPOGRAPHY.H3,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    textAlign: 'center',
    marginBottom: SPACING.SMALL,
  },
  subtitle: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LARGE,
  },
  form: {
    marginTop: SPACING.MEDIUM,
  },
  submitButton: {
    marginTop: SPACING.LARGE,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LARGE,
  },
  backButton: {
    marginTop: SPACING.XLARGE,
    width: '100%',
  },
  resendLink: {
    marginTop: SPACING.LARGE,
  },
  resendText: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.PRIMARY,
  },
});

export default ForgotPasswordScreen; 