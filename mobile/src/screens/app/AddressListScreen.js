import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, Button } from '../../components';
import { 
  fetchAddresses, 
  setDefaultAddress, 
  deleteAddress 
} from '../../redux/slices/userSlice';

const AddressCard = ({ address, isDefault, onPress, onSetDefault, onDelete }) => {
  const handleSetAsDefault = () => {
    if (!isDefault) {
      onSetDefault(address.id);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.addressCard, isDefault && styles.defaultAddressCard]} 
      onPress={() => onPress(address)}
    >
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Ionicons 
              name={address.type === 'home' ? 'home-outline' : 'business-outline'} 
              size={18} 
              color={COLORS.text} 
            />
            <Text style={styles.addressType}>
              {address.type === 'home' ? 'Home' : 'Work'}
            </Text>
          </View>
          
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.addressName}>{address.name}</Text>
        <Text style={styles.addressLine}>
          {address.street}, {address.city}
        </Text>
        <Text style={styles.addressLine}>
          {address.state}, {address.pincode}
        </Text>
        <Text style={styles.addressPhone}>{address.phone}</Text>
        
        <View style={styles.addressActions}>
          {!isDefault && (
            <TouchableOpacity 
              style={styles.defaultButton} 
              onPress={handleSetAsDefault}
            >
              <Text style={styles.defaultButtonText}>Set as Default</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(address.id)}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AddressListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { addresses, defaultAddressId, loading } = useSelector((state) => state.user);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    loadAddresses();
    
    // Check if we're in selection mode (e.g., coming from checkout)
    if (route.params?.selectMode) {
      setIsSelectionMode(true);
    }
  }, [dispatch, route.params]);

  const loadAddresses = async () => {
    try {
      await dispatch(fetchAddresses()).unwrap();
    } catch (error) {
      console.error('Failed to load addresses:', error);
      Alert.alert('Error', 'Failed to load addresses. Please try again.');
    }
  };

  const handleAddressPress = (address) => {
    if (isSelectionMode) {
      // Return selected address to previous screen
      navigation.navigate({
        name: route.params?.returnScreen || 'Checkout',
        params: { selectedAddress: address },
        merge: true,
      });
    } else {
      // Navigate to edit screen
      navigation.navigate('AddEditAddress', { address });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress({ addressId })).unwrap();
    } catch (error) {
      console.error('Failed to set default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };

  const handleDeleteAddress = (addressId) => {
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
              await dispatch(deleteAddress({ addressId })).unwrap();
            } catch (error) {
              console.error('Failed to delete address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          }
        },
      ]
    );
  };

  const renderEmptyAddresses = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Addresses Saved</Text>
      <Text style={styles.emptyText}>
        Add a new address to get your orders delivered
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="My Addresses"
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isSelectionMode ? "Select Address" : "My Addresses"}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={addresses}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            isDefault={item.id === defaultAddressId}
            onPress={handleAddressPress}
            onSetDefault={handleSetDefault}
            onDelete={handleDeleteAddress}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyAddresses}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Add New Address"
          onPress={() => navigation.navigate('AddEditAddress')}
          icon={<Ionicons name="add" size={20} color={COLORS.white} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2 + 60, // Extra space for button
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  defaultAddressCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 4,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  addressName: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 4,
  },
  addressLine: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  addressPhone: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  defaultButton: {
    marginRight: 16,
  },
  defaultButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
    marginTop: SIZES.height * 0.1,
  },
  emptyTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: 8,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default AddressListScreen; 