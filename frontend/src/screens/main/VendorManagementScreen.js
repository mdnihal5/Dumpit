import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const VendorManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    // TODO: Implement API call to fetch vendors
    // For now, using mock data
    setVendors([
      {
        id: '1',
        name: 'Tech Store',
        owner: 'John Doe',
        email: 'john@techstore.com',
        phone: '+1234567890',
        address: '123 Tech Street, City',
        category: 'Electronics',
        description: 'Your one-stop shop for all tech needs',
        logo: 'https://example.com/techstore-logo.jpg',
        status: 'active',
        rating: 4.5,
        totalOrders: 150,
        totalRevenue: 25000,
      },
      {
        id: '2',
        name: 'Fashion Boutique',
        owner: 'Jane Smith',
        email: 'jane@fashionboutique.com',
        phone: '+1987654321',
        address: '456 Fashion Ave, City',
        category: 'Fashion',
        description: 'Trendy fashion items for everyone',
        logo: 'https://example.com/fashionboutique-logo.jpg',
        status: 'pending',
        rating: 0,
        totalOrders: 0,
        totalRevenue: 0,
      },
    ]);
  }, []);

  const handleAddVendor = () => {
    // TODO: Implement API call to add vendor
    Alert.alert('Success', 'Vendor added successfully');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditVendor = () => {
    // TODO: Implement API call to update vendor
    Alert.alert('Success', 'Vendor updated successfully');
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteVendor = (vendorId) => {
    Alert.alert(
      'Delete Vendor',
      'Are you sure you want to delete this vendor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement API call to delete vendor
            Alert.alert('Success', 'Vendor deleted successfully');
          },
        },
      ]
    );
  };

  const handleStatusChange = (vendorId, newStatus) => {
    // TODO: Implement API call to update vendor status
    Alert.alert('Success', `Vendor status updated to ${newStatus}`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      description: '',
      logo: '',
    });
  };

  const renderVendorCard = ({ item }) => (
    <View style={styles.vendorCard}>
      <Image
        source={{ uri: item.logo }}
        style={styles.vendorLogo}
        defaultSource={null}
      />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={styles.vendorOwner}>Owner: {item.owner}</Text>
        <Text style={styles.vendorCategory}>{item.category}</Text>
        <Text style={styles.vendorContact}>{item.email}</Text>
        <Text style={styles.vendorContact}>{item.phone}</Text>
        <Text style={styles.vendorAddress}>{item.address}</Text>
        {item.status === 'active' && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Rating: {item.rating} ⭐</Text>
            <Text style={styles.statsText}>Orders: {item.totalOrders}</Text>
            <Text style={styles.statsText}>Revenue: ${item.totalRevenue}</Text>
          </View>
        )}
        <Text style={[
          styles.vendorStatus,
          { color: item.status === 'active' ? COLORS.success : COLORS.warning }
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedVendor(item);
            setFormData({
              name: item.name,
              owner: item.owner,
              email: item.email,
              phone: item.phone,
              address: item.address,
              category: item.category,
              description: item.description,
              logo: item.logo,
            });
            setShowEditModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusChange(item.id, 'active')}
          >
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        )}
        {item.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.suspendButton]}
            onPress={() => handleStatusChange(item.id, 'suspended')}
          >
            <Text style={styles.actionButtonText}>Suspend</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteVendor(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVendorModal = (isEdit = false) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (isEdit) {
                  setShowEditModal(false);
                } else {
                  setShowAddModal(false);
                }
                resetForm();
              }}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Vendor Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter vendor name"
            />

            <Text style={styles.formLabel}>Owner Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.owner}
              onChangeText={(text) => setFormData({ ...formData, owner: text })}
              placeholder="Enter owner name"
            />

            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={styles.formInput}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter address"
            />

            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Enter category"
            />

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.formLabel}>Logo URL</Text>
            <TextInput
              style={styles.formInput}
              value={formData.logo}
              onChangeText={(text) => setFormData({ ...formData, logo: text })}
              placeholder="Enter logo URL"
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                if (isEdit) {
                  setShowEditModal(false);
                } else {
                  setShowAddModal(false);
                }
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={isEdit ? handleEditVendor : handleAddVendor}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendor Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>Add Vendor</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={vendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {renderVendorModal()}
      {renderVendorModal(true)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: SIZES.medium,
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  vendorLogo: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    marginRight: SIZES.medium,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  vendorOwner: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  vendorCategory: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  vendorContact: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  vendorAddress: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  statsText: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  vendorStatus: {
    fontSize: FONTS.body2,
    fontWeight: '500',
    marginTop: 4,
  },
  actionButtons: {
    justifyContent: 'center',
  },
  actionButton: {
    padding: SIZES.small,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    minWidth: 80,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  suspendButton: {
    backgroundColor: COLORS.warning,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  closeButton: {
    fontSize: FONTS.large,
    color: COLORS.text.secondary,
  },
  formContainer: {
    marginBottom: SIZES.large,
  },
  formLabel: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  formInput: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    fontSize: FONTS.body1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.small,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  saveButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default VendorManagementScreen; 