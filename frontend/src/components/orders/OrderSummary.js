import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  currency = '$',
}) => {
  const calculateDiscount = () => {
    if (!discount) return 0;
    return (subtotal * discount) / 100;
  };

  const discountAmount = calculateDiscount();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <ScrollView style={styles.itemsContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {currency}{item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            {currency}{subtotal.toFixed(2)}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount ({discount}%)</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>
              -{currency}{discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {currency}{shipping.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>
            {currency}{tax.toFixed(2)}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {currency}{total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  itemsContainer: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: FONTS.body,
  },
  itemPrice: {
    fontSize: FONTS.body,
  },
  summaryContainer: {
    padding: SIZES.padding,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  summaryLabel: {
    flex: 1,
    fontSize: FONTS.body,
  },
  summaryValue: {
    fontSize: FONTS.body,
  },
  discountValue: {
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  totalLabel: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
});

export default OrderSummary; 