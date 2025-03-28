import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextStyle,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../utils/theme';
import { userService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';

interface Address {
  _id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

type Props = NativeStackScreenProps<MainStackParamList, 'SavedAddresses'>;

const SavedAddressesScreen: React.FC<Props> = ({ navigation }) => {
  // States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // New address form
  const [addressType, setAddressType] = useState('home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // Error states
  const [streetError, setStreetError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  
  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);
  
  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('Fetching addresses from: /users/addresses');
      const response = await userService.getAddresses();
      
      if (response.data && response.data.success) {
        console.log(`Successfully fetched ${response.data.data.length} addresses`);
        setAddresses(response.data.data || []);
      } else {
        console.warn('API returned unsuccessful response or invalid data format', response.data);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert(
        'Error', 
        'Unable to load your addresses. Please try again later.'
      );
      setAddresses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAddresses();
  };
  
  // Validate address form
  const validateAddressForm = () => {
    let isValid = true;
    
    // Reset errors
    setStreetError('');
    setCityError('');
    setStateError('');
    setZipCodeError('');
    
    // Validate street
    if (!street.trim()) {
      setStreetError('Street address is required');
      isValid = false;
    }
    
    // Validate city
    if (!city.trim()) {
      setCityError('City is required');
      isValid = false;
    }
    
    // Validate state
    if (!state.trim()) {
      setStateError('State is required');
      isValid = false;
    }
    
    // Validate zipCode
    if (!zipCode.trim()) {
      setZipCodeError('ZIP code is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Reset form
  const resetForm = () => {
    setAddressType('home');
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setIsDefault(false);
    setStreetError('');
    setCityError('');
    setStateError('');
    setZipCodeError('');
  };
  
  // Handle adding new address
  const handleAddAddress = async () => {
    if (!validateAddressForm()) return;
    
    try {
      setLoading(true);
      await userService.addAddress({
        type: addressType,
        street,
        city,
        state,
        zipCode,
        isDefault,
      });
      
      setShowAddModal(false);
      resetForm();
      fetchAddresses();
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle updating address
  const handleUpdateAddress = async () => {
    if (!validateAddressForm() || !selectedAddress) return;
    
    try {
      setLoading(true);
      await userService.updateAddress(selectedAddress._id, {
        type: addressType,
        street,
        city,
        state,
        zipCode,
        isDefault,
      });
      
      setShowEditModal(false);
      setSelectedAddress(null);
      resetForm();
      fetchAddresses();
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting address
  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await userService.deleteAddress(addressId);
              fetchAddresses();
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again later.');
            } finally {
              setLoading(false);
            }
          } 
        },
      ]
    );
  };
  
  // Handle setting default address
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await userService.setDefaultAddress(addressId);
      fetchAddresses();
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to update default address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (address: Address) => {
    setSelectedAddress(address);
    setAddressType(address.type);
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setZipCode(address.zipCode);
    setIsDefault(address.isDefault);
    setShowEditModal(true);
  };
  
  // Render address item
  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          {item.type === 'home' ? (
            <Feather name="home" size={18} color={colors.primary} />
          ) : item.type === 'work' ? (
            <Feather name="briefcase" size={18} color={colors.primary} />
          ) : (
            <Feather name="map-pin" size={18} color={colors.primary} />
          )}
          <Text style={styles.addressType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.addressLine}>{item.street}</Text>
      <Text style={styles.addressLine}>{`${item.city}, ${item.state} ${item.zipCode}`}</Text>
      
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.addressAction}
          onPress={() => openEditModal(item)}
        >
          <Feather name="edit-2" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        {!item.isDefault && (
          <TouchableOpacity 
            style={styles.addressAction}
            onPress={() => handleSetDefaultAddress(item._id)}
          >
            <Feather name="check-circle" size={16} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Set as Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.addressAction}
          onPress={() => handleDeleteAddress(item._id)}
        >
          <Feather name="trash-2" size={16} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="map-pin" size={60} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No Addresses Saved</Text>
      <Text style={styles.emptyText}>
        You haven't saved any addresses yet. Add an address to make checkout faster.
      </Text>
      <Button 
        title="Add New Address" 
        onPress={() => setShowAddModal(true)} 
        style={styles.emptyButton}
      />
    </View>
  );
  
  // Address form component
  const AddressForm = ({ 
    title, 
    onSubmit, 
    onCancel,
    submitText = 'Save'
  }: { 
    title: string; 
    onSubmit: () => void; 
    onCancel: () => void;
    submitText?: string;
  }) => (
    <View style={styles.formContainer}>
      <Text style={styles.modalTitle}>{title}</Text>
      
      <View style={styles.addressTypeSelector}>
        <TouchableOpacity
          style={[
            styles.typeOption,
            addressType === 'home' && styles.selectedType,
          ]}
          onPress={() => setAddressType('home')}
        >
          <Feather 
            name="home" 
            size={20} 
            color={addressType === 'home' ? colors.white : colors.primary} 
          />
          <Text style={[
            styles.typeText,
            addressType === 'home' && styles.selectedTypeText,
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeOption,
            addressType === 'work' && styles.selectedType,
          ]}
          onPress={() => setAddressType('work')}
        >
          <Feather 
            name="briefcase" 
            size={20} 
            color={addressType === 'work' ? colors.white : colors.primary} 
          />
          <Text style={[
            styles.typeText,
            addressType === 'work' && styles.selectedTypeText,
          ]}>
            Work
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeOption,
            addressType === 'other' && styles.selectedType,
          ]}
          onPress={() => setAddressType('other')}
        >
          <Feather 
            name="map-pin" 
            size={20} 
            color={addressType === 'other' ? colors.white : colors.primary} 
          />
          <Text style={[
            styles.typeText,
            addressType === 'other' && styles.selectedTypeText,
          ]}>
            Other
          </Text>
        </TouchableOpacity>
      </View>
      
      <Input
        label="Street Address"
        value={street}
        onChangeText={setStreet}
        error={streetError}
        leftIcon={<Feather name="map" size={20} color={colors.mediumGray} />}
      />
      
      <Input
        label="City"
        value={city}
        onChangeText={setCity}
        error={cityError}
        leftIcon={<Feather name="navigation" size={20} color={colors.mediumGray} />}
      />
      
      <View style={styles.formRow}>
        <Input
          label="State"
          value={state}
          onChangeText={setState}
          error={stateError}
          containerStyle={styles.stateInput}
          leftIcon={<Feather name="flag" size={20} color={colors.mediumGray} />}
        />
        
        <Input
          label="ZIP Code"
          value={zipCode}
          onChangeText={setZipCode}
          error={zipCodeError}
          keyboardType="numeric"
          containerStyle={styles.zipInput}
          leftIcon={<Feather name="hash" size={20} color={colors.mediumGray} />}
        />
      </View>
      
      <TouchableOpacity
        style={styles.defaultOption}
        onPress={() => setIsDefault(!isDefault)}
      >
        <View style={styles.checkboxContainer}>
          {isDefault ? (
            <View style={styles.checkedBox}>
              <Feather name="check" size={16} color={colors.white} />
            </View>
          ) : (
            <View style={styles.uncheckedBox} />
          )}
        </View>
        <Text style={styles.defaultOptionText}>Set as default address</Text>
      </TouchableOpacity>
      
      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Button
          title={submitText}
          onPress={onSubmit}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Addresses" showBack={true} />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddressItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Feather name="plus" size={24} color={colors.white} />
      </TouchableOpacity>
      
      {/* Add Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <AddressForm
              title="Add New Address"
              onSubmit={handleAddAddress}
              onCancel={() => {
                setShowAddModal(false);
                resetForm();
              }}
              submitText="Save Address"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Edit Address Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <AddressForm
              title="Edit Address"
              onSubmit={handleUpdateAddress}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedAddress(null);
                resetForm();
              }}
              submitText="Update Address"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    ...typography.body1,
    fontWeight: '600' as '600',
    color: colors.text,
    marginLeft: spacing.xs,
  } as TextStyle,
  defaultBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  defaultText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600' as '600',
  } as TextStyle,
  addressLine: {
    ...typography.body2,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  } as TextStyle,
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  addressAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '600' as '600',
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  } as TextStyle,
  emptyText: {
    ...typography.body2,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  } as TextStyle,
  emptyButton: {
    width: '80%',
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  formContainer: {
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.lg,
    textAlign: 'center',
  } as TextStyle,
  addressTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  selectedType: {
    backgroundColor: colors.primary,
  },
  typeText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '600' as '600',
  } as TextStyle,
  selectedTypeText: {
    color: colors.white,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stateInput: {
    flex: 1,
    marginRight: spacing.xs,
  },
  zipInput: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    marginRight: spacing.sm,
  },
  checkedBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.mediumGray,
  },
  defaultOptionText: {
    ...typography.body2,
    color: colors.text,
  } as TextStyle,
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.darkGray,
  } as TextStyle,
  submitButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default SavedAddressesScreen; 