import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  Header, 
  Button, 
  CartItem, 
  Divider, 
  Loader, 
  Badge, 
  Section 
} from '../../components';
import { Colors, Typography, SPACING, BORDER_RADIUS } from '../../styles';
import orderService from '../../services/orderService';
import { DEFAULT_PRODUCT_IMAGE } from '../../config';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      
      if (response.success) {
        setOrder(response.order);
      } else {
        Alert.alert('Error', response.message || 'Failed to load order details');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return Colors.WARNING;
      case 'shipped':
        return Colors.INFO;
      case 'delivered':
        return Colors.SUCCESS;
      case 'cancelled':
        return Colors.ERROR;
      default:
        return Colors.TEXT.SECONDARY;
    }
  };

  const handleTrackOrder = () => {
    if (order?.trackingInfo) {
      navigation.navigate('TrackOrder', { orderId: order._id });
    } else {
      Alert.alert('No Tracking Available', 'Tracking information is not available for this order yet.');
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await orderService.cancelOrder(order._id);
              
              if (response.success) {
                setOrder({ ...order, status: 'Cancelled' });
                Alert.alert('Success', 'Your order has been cancelled successfully.');
              } else {
                Alert.alert('Error', response.message || 'Failed to cancel order');
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image 
        source={{ uri: item.product.images?.[0] || DEFAULT_PRODUCT_IMAGE }} 
        style={styles.productImage} 
        resizeMode="cover"
      />
      
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        
        {item.product.vendor && (
          <Text style={styles.vendorName}>{item.product.vendor.name}</Text>
        )}
        
        <View style={styles.priceRow}>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
          <Text style={styles.price}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <Loader fullscreen text="Loading order details..." />;
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Order Details"
          leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This order could not be found.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const { 
    _id, 
    orderNumber, 
    createdAt, 
    status, 
    items, 
    shippingAddress, 
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    total,
    trackingInfo
  } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const canCancel = ['Processing'].includes(status);
  const canTrack = ['Shipped', 'Delivered'].includes(status) && trackingInfo;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Order Details"
        leftIcon={<Feather name="arrow-left" size={24} color={Colors.TEXT.PRIMARY} />}
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumberLabel}>Order Number:</Text>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Badge 
              label={status} 
              color={getStatusColor(status)}
              backgroundColor={`${getStatusColor(status)}20`}
            />
          </View>
          
          <Text style={styles.orderDate}>Placed on {formattedDate}</Text>
        </View>
        
        <Divider marginVertical={SPACING.MEDIUM} />
        
        {/* Order Items */}
        <Section title={`Items (${items.length})`}>
          <FlatList
            data={items}
            renderItem={renderOrderItem}
            keyExtractor={(item, index) => `${item.product._id}-${index}`}
            scrollEnabled={false}
          />
        </Section>
        
        <Divider marginVertical={SPACING.MEDIUM} />
        
        {/* Shipping Address */}
        <Section title="Shipping Address">
          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>{shippingAddress.name}</Text>
            <Text style={styles.addressText}>{shippingAddress.street}</Text>
            <Text style={styles.addressText}>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </Text>
            <Text style={styles.addressText}>{shippingAddress.country}</Text>
            <Text style={styles.addressText}>{shippingAddress.phone}</Text>
          </View>
        </Section>
        
        <Divider marginVertical={SPACING.MEDIUM} />
        
        {/* Payment Details */}
        <Section title="Payment Information">
          <View style={styles.paymentContainer}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment Method:</Text>
              <Text style={styles.paymentValue}>
                {paymentMethod.type === 'card' 
                  ? `${paymentMethod.brand} **** ${paymentMethod.last4}` 
                  : paymentMethod.type}
              </Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subtotal:</Text>
              <Text style={styles.paymentValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            {tax > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Tax:</Text>
                <Text style={styles.paymentValue}>${tax.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Shipping:</Text>
              <Text style={styles.paymentValue}>${shippingCost.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </Section>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {canTrack && (
            <Button
              title="Track Order"
              onPress={handleTrackOrder}
              icon={<Feather name="map-pin" size={20} color={Colors.WHITE} />}
              style={styles.actionButton}
            />
          )}
          
          {canCancel && (
            <Button
              title="Cancel Order"
              type="outline"
              onPress={handleCancelOrder}
              icon={<Feather name="x" size={20} color={Colors.ERROR} />}
              style={[styles.actionButton, styles.cancelButton]}
              textStyle={{ color: Colors.ERROR }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
  },
  scrollContent: {
    padding: SPACING.MEDIUM,
  },
  orderSummary: {
    marginBottom: SPACING.MEDIUM,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  orderNumberLabel: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    marginRight: SPACING.XSMALL,
  },
  orderNumber: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  statusContainer: {
    marginBottom: SPACING.SMALL,
  },
  orderDate: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
    padding: SPACING.SMALL,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  productDetails: {
    flex: 1,
    marginLeft: SPACING.SMALL,
    justifyContent: 'space-between',
  },
  productName: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.TINY,
  },
  vendorName: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
    marginBottom: SPACING.TINY,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    ...Typography.TYPOGRAPHY.BODY_SMALL,
    color: Colors.TEXT.SECONDARY,
  },
  price: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  addressContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  addressName: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.TINY,
  },
  addressText: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    marginBottom: SPACING.TINY,
  },
  paymentContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SMALL,
  },
  paymentLabel: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
  },
  paymentValue: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.PRIMARY,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER.LIGHT,
    paddingTop: SPACING.SMALL,
    marginTop: SPACING.SMALL,
  },
  totalLabel: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.TEXT.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.MEDIUM,
  },
  totalValue: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.PRIMARY,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
  },
  actionsContainer: {
    marginTop: SPACING.LARGE,
    marginBottom: SPACING.LARGE,
  },
  actionButton: {
    marginBottom: SPACING.MEDIUM,
  },
  cancelButton: {
    borderColor: Colors.ERROR,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  errorText: {
    ...Typography.TYPOGRAPHY.BODY_LARGE,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LARGE,
  },
  errorButton: {
    minWidth: 150,
  },
});

export default OrderDetailsScreen; 