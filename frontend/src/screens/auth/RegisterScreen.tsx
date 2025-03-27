import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { registerSchema } from '../../utils/validation';
import useAuth from '../../hooks/useAuth';
import { BRANDING } from '../../utils/constants';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { register, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [role, setRole] = useState('user');
  const [roleError, setRoleError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const validateForm = () => {
    // Reset all previous errors
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setRoleError('');
    
    // Validate using Zod schema
    const result = registerSchema.safeParse({
      name,
      email,
      phone,
      password,
      confirmPassword,
      role
    });
    
    if (!result.success) {
      // Format errors from Zod
      const formattedErrors = result.error.format();
      
      if (formattedErrors.name?._errors?.length) {
        setNameError(formattedErrors.name._errors[0]);
      }
      
      if (formattedErrors.email?._errors?.length) {
        setEmailError(formattedErrors.email._errors[0]);
      }
      
      if (formattedErrors.phone?._errors?.length) {
        setPhoneError(formattedErrors.phone._errors[0]);
      }
      
      if (formattedErrors.password?._errors?.length) {
        setPasswordError(formattedErrors.password._errors[0]);
      }
      
      if (formattedErrors.confirmPassword?._errors?.length) {
        setConfirmPasswordError(formattedErrors.confirmPassword._errors[0]);
      } else if (formattedErrors._errors?.length) {
        // This handles the refine error for password matching
        setConfirmPasswordError(formattedErrors._errors[0]);
      }
      
      if (formattedErrors.role?._errors?.length) {
        setRoleError(formattedErrors.role._errors[0]);
      }
      
      return false;
    }
    
    return true;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const result = await register({
          name,
          email,
          phone,
          password,
          role: role as 'user' | 'vendor'
        });
        
        if (result.success) {
          // Registration successful, navigation will be handled by auth state
        } else {
          Alert.alert('Registration Failed', result.error || 'Please check your information and try again.');
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
            <Text style={styles.titleText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              {BRANDING.TAGLINE}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={nameError}
              autoCapitalize="words"
              leftIcon={<Feather name="user" size={20} color={colors.mediumGray} />}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Feather name="mail" size={20} color={colors.mediumGray} />}
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              error={phoneError}
              keyboardType="phone-pad"
              leftIcon={<Feather name="phone" size={20} color={colors.mediumGray} />}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
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
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              secureTextEntry={!showConfirmPassword}
              leftIcon={<Feather name="lock" size={20} color={colors.mediumGray} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.mediumGray}
                  />
                </TouchableOpacity>
              }
            />
            
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Select your role</Text>
              {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}
              
              <View style={styles.roleOptions}>
                <TouchableOpacity 
                  style={[
                    styles.roleOption, 
                    role === 'user' && styles.roleOptionSelected
                  ]}
                  onPress={() => setRole('user')}
                >
                  <Feather 
                    name="user" 
                    size={20} 
                    color={role === 'user' ? colors.white : colors.mediumGray} 
                  />
                  <Text style={[
                    styles.roleText,
                    role === 'user' && styles.roleTextSelected
                  ]}>
                    Customer
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.roleOption, 
                    role === 'vendor' && styles.roleOptionSelected
                  ]}
                  onPress={() => setRole('vendor')}
                >
                  <Feather 
                    name="briefcase" 
                    size={20} 
                    color={role === 'vendor' ? colors.white : colors.mediumGray} 
                  />
                  <Text style={[
                    styles.roleText,
                    role === 'vendor' && styles.roleTextSelected
                  ]}>
                    Vendor
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.roleDescription}>
                {role === 'user' 
                  ? 'As a customer, you can browse and purchase construction materials.'
                  : 'As a vendor, you can sell your construction materials on our platform.'
                }
              </Text>
            </View>
            
            <Button
              variant="primary"
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign in</Text>
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
  titleText: {
    fontSize: typography.h1.fontSize,
    fontWeight: '700',
    lineHeight: typography.h1.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    lineHeight: typography.body1.lineHeight,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  formContainer: {
    width: '100%',
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    lineHeight: typography.body1.lineHeight,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.background,
    width: '48%',
  },
  roleOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: typography.body2.fontSize,
    fontWeight: '500',
    marginLeft: spacing.xs,
    color: colors.text,
  },
  roleTextSelected: {
    color: colors.white,
  },
  roleDescription: {
    fontSize: typography.caption.fontSize,
    fontWeight: '400',
    lineHeight: typography.caption.lineHeight,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    fontSize: typography.body2.fontSize,
    fontWeight: '400',
    lineHeight: typography.body2.lineHeight,
    color: colors.darkGray,
  },
  loginLink: {
    fontSize: typography.body2.fontSize,
    fontWeight: "bold",
    lineHeight: typography.body2.lineHeight,
    color: colors.primary,
  },
});

export default RegisterScreen; 