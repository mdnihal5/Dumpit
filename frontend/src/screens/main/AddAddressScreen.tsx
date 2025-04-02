import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { userService } from '../../api/services';
import { AddressData } from '../../api/types';
import { colors, spacing, typography } from '../../utils/theme';

interface Errors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Validate state
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    // Validate postal code
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    // Validate country
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof Errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleDefault = () => {
    setFormData(prev => ({
      ...prev,
      isDefault: !prev.isDefault
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await userService.addAddress(formData);
      
      if (response.data?.success) {
        Alert.alert('Success', 'Address added successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Add address error:', error);
      Alert.alert('Error', 'An error occurred while adding the address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add New Address" showBack onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Input 
              label="Name / Title"
              placeholder="Home, Office, etc."
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name}
            />
            
            <Input 
              label="Street Address"
              placeholder="Street address or P.O. Box"
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              error={errors.address}
            />
            
            <Input 
              label="City"
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              error={errors.city}
            />
            
            <View style={styles.row}>
              <Input 
                label="State/Province"
                placeholder="Enter state"
                value={formData.state}
                onChangeText={(text) => handleChange('state', text)}
                error={errors.state}
                containerStyle={styles.halfInput}
              />
              
              <Input 
                label="Postal Code"
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChangeText={(text) => handleChange('postalCode', text)}
                error={errors.postalCode}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
            </View>
            
            <Input 
              label="Country"
              placeholder="Enter country"
              value={formData.country}
              onChangeText={(text) => handleChange('country', text)}
              error={errors.country}
            />
            
            <Input 
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              error={errors.phone}
              keyboardType="phone-pad"
            />
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as default address</Text>
              <Switch
                value={formData.isDefault}
                onValueChange={toggleDefault}
                trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
                thumbColor={formData.isDefault ? colors.primary : colors.white}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Save Address"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default AddAddressScreen;
