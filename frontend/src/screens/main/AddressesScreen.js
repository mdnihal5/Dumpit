import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../store/slices/userSlice';

const AddressesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.user);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingAddress) {
      dispatch(updateAddress({ id: editingAddress.id, ...formData }));
      Alert.alert('Success', 'Address updated successfully');
    } else {
      dispatch(addAddress({ ...formData, id: Date.now().toString() }));
      Alert.alert('Success', 'Address added successfully');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddModal(true);
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteAddress(addressId));
            Alert.alert('Success', 'Address deleted successfully');
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId) => {
    dispatch(setDefaultAddress(addressId));
    Alert.alert('Success', 'Default address updated successfully');
  };

  const renderAddressCard = (address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
        </View>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      <Text style={styles.addressText}>{address.street}</Text>
      <Text style={styles.addressText}>
        {address.city}, {address.state} {address.pincode}
      </Text>
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(address)}
        >
          <Icon name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Icon name="delete" size={20} color={COLORS.error} />
        </TouchableOpacity>
        {!address.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Icon name="star-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              <Icon name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <Input
              label="Street Address"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              placeholder="Enter your street address"
            />
            <Input
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Enter your city"
            />
            <Input
              label="State"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="Enter your state"
            />
            <Input
              label="PIN Code"
              value={formData.pincode}
              onChangeText={(text) => setFormData({ ...formData, pincode: text })}
              placeholder="Enter your PIN code"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            >
              <Icon
                name={formData.isDefault ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.checkboxLabel}>Set as default address</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button title="Save Address" onPress={handleSaveAddress} />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Addresses</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {addresses.map(renderAddressCard)}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setShowAddModal(true);
        }}
      >
        <Icon name="plus" size={24} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      {renderAddModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.medium,
  },
  title: {
    fontSize: FONTS.size.h2,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: SPACING.large,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.medium,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.small,
  },
  addressName: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  addressPhone: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.xsmall,
    borderRadius: BORDER_RADIUS.small,
  },
  defaultText: {
    color: COLORS.white,
    fontSize: FONTS.size.h5,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginBottom: SPACING.small,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.medium,
  },
  actionButton: {
    padding: SPACING.small,
    marginLeft: SPACING.medium,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.large,
    margin: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginLeft: SPACING.small,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: SPACING.large,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
  checkboxLabel: {
    fontSize: FONTS.size.h4,
    marginLeft: SPACING.small,
  },
  modalFooter: {
    padding: SPACING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default AddressesScreen; 