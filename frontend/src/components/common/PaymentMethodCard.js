import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const PaymentMethodCard = ({
  method,
  isSelected,
  onSelect,
  onDelete,
  showActions = true,
}) => {
  const getCardIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return require('../../assets/icons/visa.png');
      case 'mastercard':
        return require('../../assets/icons/mastercard.png');
      case 'paypal':
        return require('../../assets/icons/paypal.png');
      default:
        return require('../../assets/icons/credit-card.png');
    }
  };

  const maskCardNumber = (number) => {
    return `•••• ${number.slice(-4)}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onSelect}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={getCardIcon(method.type)}
            style={styles.cardIcon}
          />
          <Text style={styles.cardType}>{method.type}</Text>
        </View>

        <Text style={styles.cardNumber}>{maskCardNumber(method.number)}</Text>
        <Text style={styles.expiry}>Expires {method.expiry}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
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
  selectedContainer: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: SIZES.small,
  },
  cardType: {
    fontSize: FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  cardNumber: {
    fontSize: FONTS.body1,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  expiry: {
    fontSize: FONTS.body2,
    color: COLORS.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.medium,
  },
  actionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default PaymentMethodCard; 