import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Switch,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, Button, TextInput } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, updateAddress, selectAddressById } from '../../redux/slices/userSlice';

const AddEditAddressScreen = ({ route, navigation }) => {
  const { addressId, isSelectMode = false } = route.params || {};
  const isEdit = !!addressId;
  
  const dispatch = useDispatch();
  const existingAddress = useSelector(state => 
    isEdit ? selectAddressById(state, addressId) : null
  );
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Load existing address data if in edit mode
  useEffect(() => {
    if (existingAddress) {
      setName(existingAddress.name);
      setPhone(existingAddress.phone);
      setStreet(existingAddress.street);
      setCity(existingAddress.city);
      setState(existingAddress.state);
      setZipCode(existingAddress.zipCode);
      setCountry(existingAddress.country);
      setIsDefault(existingAddress.isDefault);
    }
  }, [existingAddress]);
  
  // Validate form fields
  const validateForm = () => {
    let newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (phone.trim() && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!street.trim()) newErrors.street = 'Street address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (zipCode.trim() && !/^\d{6}$/.test(zipCode)) {
      newErrors.zipCode = 'Enter a valid 6-digit ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save address
  const handleSaveAddress = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const addressData = {
        id: isEdit ? addressId : `addr_${Date.now()}`,
        name,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault
      };
      
      if (isEdit) {
        await dispatch(updateAddress(addressData)).unwrap();
      } else {
        await dispatch(addAddress(addressData)).unwrap();
      }
      
      if (isSelectMode) {
        // If we're in select mode, go back to the previous screen with the selected address
        navigation.navigate('Checkout', { selectedAddress: addressData });
      } else {
        // Otherwise, go back to the address list
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <Header
          title={isEdit ? 'Edit Address' : 'Add New Address'}
          onBack={() => navigation.goBack()}
        />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <TextInput
              label="Full Name"
              placeholder="Enter full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            
            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Street Address"
              placeholder="Enter street address"
              value={street}
              onChangeText={setStreet}
              error={errors.street}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.row}>
              <View style={styles.halfColumn}>
                <TextInput
                  label="City"
                  placeholder="Enter city"
                  value={city}
                  onChangeText={setCity}
                  error={errors.city}
                />
              </View>
              
              <View style={styles.halfColumn}>
                <TextInput
                  label="State"
                  placeholder="Enter state"
                  value={state}
                  onChangeText={setState}
                  error={errors.state}
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfColumn}>
                <TextInput
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  error={errors.zipCode}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
              
              <View style={styles.halfColumn}>
                <TextInput
                  label="Country"
                  placeholder="Enter country"
                  value={country}
                  onChangeText={setCountry}
                  error={errors.country}
                />
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as default address</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={isDefault ? COLORS.primaryDark : COLORS.lightGray}
              />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title={isEdit ? 'Update Address' : 'Save Address'}
            onPress={handleSaveAddress}
            loading={loading}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for button
  },
  formContainer: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.small,
  },
  halfColumn: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
    paddingVertical: SIZES.small,
  },
  switchLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default AddEditAddressScreen; 