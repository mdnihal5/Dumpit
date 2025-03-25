import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const DeliveryTimeline = ({
  status,
  trackingNumber,
  estimatedDelivery,
  currentLocation,
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
        return 'Order Placed';
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
        return '📦';
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
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Timeline</Text>
        <Text style={styles.trackingNumber}>
          Tracking: {trackingNumber}
        </Text>
      </View>

      <View style={styles.timeline}>
        <View style={styles.timelineItem}>
          <View style={styles.timelineIcon}>
            <Text style={styles.iconText}>{getStatusIcon(status)}</Text>
          </View>
          <View style={styles.timelineContent}>
            <Text style={[
              styles.timelineStatus,
              { color: getStatusColor(status) }
            ]}>
              {getStatusText(status)}
            </Text>
            {currentLocation && (
              <Text style={styles.timelineLocation}>
                Current Location: {currentLocation}
              </Text>
            )}
          </View>
        </View>

        {status.toLowerCase() !== 'delivered' && (
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Text style={styles.iconText}>📅</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>
                Estimated Delivery
              </Text>
              <Text style={styles.timelineLocation}>
                {estimatedDelivery}
              </Text>
            </View>
          </View>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  trackingNumber: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  timeline: {
    marginLeft: SIZES.medium,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  iconText: {
    fontSize: FONTS.h3,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timelineLocation: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
});

export default DeliveryTimeline; 