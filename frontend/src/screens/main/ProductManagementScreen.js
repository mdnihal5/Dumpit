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

const ProductManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    // TODO: Implement API call to fetch products
    // For now, using mock data
    setProducts([
      {
        id: '1',
        name: 'Product 1',
        description: 'Description for product 1',
        price: 99.99,
        stock: 50,
        category: 'Electronics',
        image: 'https://example.com/product1.jpg',
        status: 'active',
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description for product 2',
        price: 149.99,
        stock: 30,
        category: 'Fashion',
        image: 'https://example.com/product2.jpg',
        status: 'inactive',
      },
    ]);
  }, []);

  const handleAddProduct = () => {
    // TODO: Implement API call to add product
    Alert.alert('Success', 'Product added successfully');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = () => {
    // TODO: Implement API call to update product
    Alert.alert('Success', 'Product updated successfully');
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement API call to delete product
            Alert.alert('Success', 'Product deleted successfully');
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: '',
    });
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        defaultSource={null}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
        <Text style={[
          styles.productStatus,
          { color: item.status === 'active' ? COLORS.success : COLORS.error }
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedProduct(item);
            setFormData({
              name: item.name,
              description: item.description,
              price: item.price.toString(),
              stock: item.stock.toString(),
              category: item.category,
              image: item.image,
            });
            setShowEditModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProductModal = (isEdit = false) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
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
            <Text style={styles.formLabel}>Product Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter product name"
            />

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter product description"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.formLabel}>Price</Text>
            <TextInput
              style={styles.formInput}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Enter price"
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Stock</Text>
            <TextInput
              style={styles.formInput}
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              placeholder="Enter stock quantity"
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Enter category"
            />

            <Text style={styles.formLabel}>Image URL</Text>
            <TextInput
              style={styles.formInput}
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
              placeholder="Enter image URL"
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
              onPress={isEdit ? handleEditProduct : handleAddProduct}
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
        <Text style={styles.title}>Product Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {renderProductModal()}
      {renderProductModal(true)}
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
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    marginRight: SIZES.medium,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  productCategory: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  productPrice: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  productStock: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  productStatus: {
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

export default ProductManagementScreen; 