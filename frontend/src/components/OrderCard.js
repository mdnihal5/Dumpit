import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, SPACING, BORDER_RADIUS, SHADOWS } from '../styles';

const OrderCard = ({
  order,
  onPress,
  onTrack,
  style,
  ...props
}) => {
  if (!order) return null;

  const {
    _id,
    orderNumber,
    status,
    createdAt,
    totalAmount,
    items = [],
    deliveryAddress,
    trackingInfo,
  } = order;

  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Format date
  const orderDate = new Date(createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return Colors.PRIMARY;
      case 'shipped':
        return Colors.INFO;
      case 'delivered':
        return Colors.SECONDARY;
      case 'cancelled':
        return Colors.DANGER;
      default:
        return Colors.TEXT.SECONDARY;
    }
  };

  // Capitalize status text
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {/* Order Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{formattedStatus}</Text>
        </View>
      </View>
      
      {/* Order Details */}
      <View style={styles.content}>
        {/* Order summary */}
        <View style={styles.row}>
          <Text style={styles.label}>Items:</Text>
          <Text style={styles.value}>{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
        </View>
        
        {/* Order total */}
        <View style={styles.row}>
          <Text style={styles.label}>Order Total:</Text>
          <Text style={styles.total}>${totalAmount.toFixed(2)}</Text>
        </View>
        
        {/* Delivery Address (shortened) */}
        {deliveryAddress && (
          <View style={styles.row}>
            <Text style={styles.label}>Delivery:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {deliveryAddress.street}, {deliveryAddress.city}
            </Text>
          </View>
        )}
      </View>
      
      {/* Track Button (for shipped orders) */}
      {status === 'shipped' && trackingInfo && onTrack && (
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => onTrack(order)}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
    marginBottom: SPACING.MEDIUM,
    ...SHADOWS.SMALL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER.LIGHT,
  },
  orderNumber: {
    ...Typography.TYPOGRAPHY.BODY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    color: Colors.TEXT.PRIMARY,
  },
  date: {
    ...Typography.TYPOGRAPHY.CAPTION,
    color: Colors.TEXT.SECONDARY,
    marginTop: SPACING.TINY,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  statusText: {
    ...Typography.TYPOGRAPHY.CAPTION,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    color: Colors.TEXT.INVERSE,
  },
  content: {
    padding: SPACING.MEDIUM,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  label: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
  },
  value: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.PRIMARY,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.MEDIUM,
  },
  total: {
    ...Typography.TYPOGRAPHY.BODY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    color: Colors.TEXT.PRIMARY,
  },
  trackButton: {
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    padding: SPACING.MEDIUM,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER.LIGHT,
  },
  trackButtonText: {
    ...Typography.TYPOGRAPHY.BUTTON_SMALL,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
});

export default OrderCard; 