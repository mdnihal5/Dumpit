import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import { userService } from '../../api/services';
import { Address } from '../../api/types';
import Button from '../../components/Button';

const SavedAddressesScreen = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await userService.getAddresses();
      if (response.data?.success && response.data.data) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
      return () => {};
    }, [])
  );

  const handleSetDefault = async (addressId: string) => {
    try {
      setLoading(true);
      const response = await userService.setDefaultAddress(addressId);
      if (response.data?.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
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
              const response = await userService.deleteAddress(addressId);
              if (response.data?.success) {
                fetchAddresses();
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditAddress = (address: Address) => {
    // @ts-ignore
    navigation.navigate('EditAddress', { addressId: address._id });
  };

  const handleAddAddress = () => {
    // @ts-ignore
    navigation.navigate('AddAddress');
  };

  const renderItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{item.name}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <Text style={styles.addressDetails}>
        {item.addressLine1}
        {item.addressLine2 ? `, ${item.addressLine2}` : ''}
      </Text>
      <Text style={styles.addressDetails}>
        {item.city}, {item.state} {item.postalCode}
      </Text>
      <Text style={styles.addressDetails}>{item.country}</Text>
      <Text style={styles.phone}>{item.phone}</Text>

      <View style={styles.actions}>
        {!item.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefault(item._id || '')}
          >
            <Icon name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.actionText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditAddress(item)}
        >
          <Icon name="pencil" size={18} color="#2196F3" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(item._id || '')}
        >
          <Icon name="delete" size={18} color="#F44336" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Saved Addresses" showBack onBackPress={() => navigation.goBack()} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <>
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="map-marker-off" size={60} color="#757575" />
              <Text style={styles.emptyText}>No saved addresses found</Text>
              <Text style={styles.emptySubtext}>
                Add a new address to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={addresses}
              renderItem={renderItem}
              keyExtractor={(item) => item._id || Math.random().toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Add New Address" 
              onPress={handleAddAddress}
              leftIcon={<Icon name="plus" size={20} color="#fff" />}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SavedAddressesScreen; 