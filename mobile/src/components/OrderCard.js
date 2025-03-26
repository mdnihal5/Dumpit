import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';
import Card from './Card';

/**
 * OrderCard component for displaying order history
 * 
 * @param {Object} props
 * @param {Object} props.order - Order data
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Object} props.style - Additional style for the card
 */
const OrderCard = ({
  order,
  onPress,
  style,
}) => {
  if (!order) return null;

  const {
    orderNumber,
    status,
    vendor,
    items = [],
    billing = {},
    createdAt,
  } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const displayItems = items.slice(0, 2);
  const remainingItems = items.length - displayItems.length;

  const getStatusColor = () => {
    switch (status) {
      case 'delivered':
        return COLORS.success;
      case 'processing':
      case 'confirmed':
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return COLORS.warning;
      case 'cancelled':
      case 'returned':
      case 'refunded':
        return COLORS.error;
      default:
        return COLORS.info;
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <Card 
      onPress={onPress} 
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.vendorRow}>
        <Text style={styles.vendorLabel}>Vendor:</Text>
        <Text style={styles.vendorName} numberOfLines={1}>
          {vendor?.businessName || 'Unknown Vendor'}
        </Text>
      </View>
      
      <View style={styles.itemsContainer}>
        {displayItems.map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        {remainingItems > 0 && (
          <Text style={styles.moreItems}>+{remainingItems} more items</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalItems}>{totalItems} items</Text>
        <Text style={styles.totalAmount}>₹{billing.total?.toFixed(2) || '0.00'}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '500',
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  vendorName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    flex: 1,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    marginBottom: 2,
  },
  moreItems: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  totalItems: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default OrderCard; 