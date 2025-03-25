import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const OrderStatus = ({
  status,
  onStatusPress,
  showActions = true,
}) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return COLORS.warning;
      case 'processing':
        return COLORS.info;
      case 'shipped':
        return COLORS.primary;
      case 'delivered':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.text.secondary;
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusIcon}>{getStatusIcon(status)}</Text>
        <Text style={[
          styles.statusText,
          { color: getStatusColor(status) }
        ]}>
          {getStatusText(status)}
        </Text>
      </View>

      {showActions && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onStatusPress}
        >
          <Text style={styles.actionButtonText}>Update Status</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  statusIcon: {
    fontSize: FONTS.h2,
    marginRight: SIZES.small,
  },
  statusText: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default OrderStatus; 