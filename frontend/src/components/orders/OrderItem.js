import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const OrderItem = ({
  item,
  onPress,
  showActions = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        defaultSource={require('../../assets/images/placeholder.png')}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.variant}>{item.variant}</Text>
        <View style={styles.details}>
          <Text style={styles.quantity}>x{item.quantity}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton]}
            onPress={() => onPress(item.id, 'review')}
          >
            <Text style={styles.actionButtonText}>Review</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.reorderButton]}
            onPress={() => onPress(item.id, 'reorder')}
          >
            <Text style={styles.actionButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    marginRight: SIZES.medium,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  variant: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  price: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  actions: {
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
  },
  reorderButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default OrderItem; 