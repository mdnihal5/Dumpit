import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing } from '../../utils/theme';
import { profileUpdateSchema } from '../../utils/validation';
import { userService } from '../../services/api';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';

interface ProfileEditFormProps {
  user: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  
  // State for form fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Form validation using Zod
  const validateForm = () => {
    // Reset all errors
    setNameError('');
    setEmailError('');
    setPhoneError('');
    
    // Validate using Zod schema
    const result = profileUpdateSchema.safeParse({ name, email, phone });
    
    if (!result.success) {
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
      
      return false;
    }
    
    return true;
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const response = await userService.updateProfile({
        name,
        phone
      });
      
      if (response.data.success) {
        // Update the user in Redux state
        dispatch(updateUserProfile({ name, phone }));
        
        Alert.alert('Success', 'Profile updated successfully');
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          onCancel(); // Close edit form
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.editForm}>
      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        error={nameError}
        leftIcon={<Feather name="user" size={20} color={colors.mediumGray} />}
      />
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Feather name="mail" size={20} color={colors.mediumGray} />}
        disabled={true} // Email cannot be changed
      />
      
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        error={phoneError}
        keyboardType="phone-pad"
        leftIcon={<Feather name="phone" size={20} color={colors.mediumGray} />}
      />
      
      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Save"
          onPress={handleSaveProfile}
          loading={isLoading}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editForm: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default ProfileEditForm; 