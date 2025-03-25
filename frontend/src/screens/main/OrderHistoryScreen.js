import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const OrderHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Mock data for orders
  const orders = [
    {
      id: '1',
      orderNumber: '#ORD-001',
      vendor: 'Tech Store',
      amount: 150,
      status: 'completed',
      date: '2024-03-25',
      items: [
        {
          id: '1',
          name: 'Product 1',
          quantity: 2,
          price: 75,
        },
      ],
    },
    {
      id: '2',
      orderNumber: '#ORD-002',
      vendor: 'Fashion Boutique',
      amount: 200,
      status: 'cancelled',
      date: '2024-03-24',
      items: [
        {
          id: '2',
          name: 'Product 2',
          quantity: 1,
          price: 200,
        },
      ],
    },
    // Add more mock orders...
  ];

  const statusOptions = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Amount', value: 'highest' },
    { label: 'Lowest Amount', value: 'lowest' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement API call to refresh orders
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'processing':
        return COLORS.info;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.text.secondary;
    }
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <Text style={[
          styles.orderStatus,
          { color: getStatusColor(item.status) }
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        <Text style={styles.orderAmount}>${item.amount}</Text>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((product) => (
          <View key={product.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemQuantity}>x{product.quantity}</Text>
            <Text style={styles.itemPrice}>${product.price}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Orders</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Status</Text>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  selectedStatus === option.value && styles.selectedFilter,
                ]}
                onPress={() => setSelectedStatus(option.value)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedStatus === option.value && styles.selectedFilterText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  selectedSort === option.value && styles.selectedFilter,
                ]}
                onPress={() => setSelectedSort(option.value)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedSort === option.value && styles.selectedFilterText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setSelectedStatus('all');
                setSelectedSort('newest');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {renderFilterModal()}
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
  filterButton: {
    padding: SIZES.small,
  },
  filterButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.primary,
  },
  listContainer: {
    padding: SIZES.medium,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  orderNumber: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  orderDate: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  orderStatus: {
    fontSize: FONTS.body2,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  vendorName: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  orderAmount: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.small,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginHorizontal: SIZES.small,
  },
  itemPrice: {
    fontSize: FONTS.body2,
    color: COLORS.text.primary,
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
  filterSection: {
    marginBottom: SIZES.large,
  },
  filterTitle: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  filterOption: {
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    backgroundColor: COLORS.lightGray,
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  selectedFilterText: {
    color: COLORS.white,
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
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.text.primary,
  },
  applyButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen; 