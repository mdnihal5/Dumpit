import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { userService } from '../../api/services';
import { AddressData, Address } from '../../api/types';

const EditAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addressId } = route.params as { addressId: string };
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<AddressData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      setFetchLoading(true);
      // Get the addresses and find the one with matching ID
      const response = await userService.getAddresses();
      
      if (response.data?.success && response.data.data) {
        const address = response.data.data.find((addr: Address) => addr._id === addressId);
        if (address) {
          setFormData({
            name: address.name || '',
            address: address.addressLine1 || '', // Map addressLine1 to address field
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || '',
            phone: address.phone || '',
            isDefault: address.isDefault || false
          });
        } else {
          Alert.alert('Error', 'Address not found');
          navigation.goBack();
        }
      } else {
        Alert.alert('Error', 'Failed to fetch address details');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'An error occurred while fetching the address');
      navigation.goBack();
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDefault = () => {
    setFormData(prev => ({
      ...prev,
      isDefault: !prev.isDefault
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.address || !formData.city || 
        !formData.state || !formData.postalCode || !formData.country || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateAddress(addressId, formData);
      
      if (response.data?.success) {
        Alert.alert('Success', 'Address updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'An error occurred while updating the address');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Address" showBack onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            {/* Name / Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name / Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Home, Office, etc."
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                returnKeyType="next"
              />
            </View>
            
            {/* Street Address */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Street address or P.O. Box"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
                returnKeyType="next"
              />
            </View>
            
            {/* City */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleChange('city', value)}
                returnKeyType="next"
              />
            </View>
            
            {/* State and Postal Code */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(value) => handleChange('state', value)}
                  returnKeyType="next"
                />
              </View>
              
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChangeText={(value) => handleChange('postalCode', value)}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
            </View>
            
            {/* Country */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={formData.country}
                onChangeText={(value) => handleChange('country', value)}
                returnKeyType="next"
              />
            </View>
            
            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </View>
            
            {/* Default Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={toggleDefault}
            >
              <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
                {formData.isDefault && <Icon name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Set as default address</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Update Address"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  }
});

export default EditAddressScreen;