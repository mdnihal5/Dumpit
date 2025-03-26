import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Header, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../../redux/slices/orderSlice';

const trackingSteps = [
  {
    id: 'ordered',
    title: 'Order Placed',
    description: 'Your order has been received',
    icon: 'receipt-outline',
  },
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    description: 'Your order has been confirmed',
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'processing',
    title: 'Processing',
    description: 'Your order is being processed',
    icon: 'construct-outline',
  },
  {
    id: 'shipped',
    title: 'Shipped',
    description: 'Your order has been shipped',
    icon: 'cube-outline',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Your order has been delivered',
    icon: 'home-outline',
  },
];

// Map status from backend to tracking step
const mapStatusToStep = (status) => {
  switch (status) {
    case 'pending':
      return 'ordered';
    case 'confirmed':
      return 'confirmed';
    case 'processing':
      return 'processing';
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'ordered';
  }
};

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector(state => state.orders);
  const [currentStatus, setCurrentStatus] = useState('ordered');
  
  // Mock expected delivery date (3 days from order date)
  const [expectedDelivery, setExpectedDelivery] = useState(new Date());
  
  useEffect(() => {
    // Fetch order details
    dispatch(getOrderById(orderId));
  }, [orderId]);
  
  useEffect(() => {
    if (orderDetails) {
      // Set current status based on order status
      setCurrentStatus(mapStatusToStep(orderDetails.status));
      
      // Calculate expected delivery date
      const orderDate = new Date(orderDetails.createdAt || new Date());
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      setExpectedDelivery(deliveryDate);
    }
  }, [orderDetails]);

  const formatDate = (date) => {
    const options = { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit' 
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  const getStepStatus = (stepId) => {
    if (stepId === 'cancelled' && currentStatus === 'cancelled') {
      return 'current';
    }
    
    const currentIndex = trackingSteps.findIndex(step => step.id === currentStatus);
    const stepIndex = trackingSteps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  // Generate ETA based on current status
  const getETA = () => {
    const now = new Date();
    const targetDate = expectedDelivery;
    
    // If already delivered
    if (currentStatus === 'delivered') {
      return 'Delivered';
    }
    
    // If cancelled
    if (currentStatus === 'cancelled') {
      return 'Cancelled';
    }
    
    // If expected delivery is in the past but not delivered yet
    if (targetDate < now && currentStatus !== 'delivered') {
      return 'Arriving soon';
    }
    
    // Calculate days remaining
    const diffTime = Math.abs(targetDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Arriving today';
    } else if (diffDays === 1) {
      return 'Arriving tomorrow';
    } else {
      return `Arriving in ${diffDays} days`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Order Tracking" onBack={() => navigation.goBack()} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      ) : orderDetails ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Order Info */}
          <View style={styles.infoCard}>
            <View style={styles.orderInfo}>
              <View>
                <Text style={styles.orderId}>Order #{orderId.substring(0, 8)}</Text>
                <Text style={styles.orderDate}>
                  Placed on {formatDate(new Date(orderDetails.createdAt || new Date()))}
                </Text>
              </View>
              
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {currentStatus === 'cancelled' ? 'Cancelled' : trackingSteps.find(step => step.id === currentStatus)?.title}
                </Text>
              </View>
            </View>
            
            <View style={styles.deliveryInfo}>
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={currentStatus === 'delivered' ? COLORS.success : COLORS.primary} 
              />
              <Text style={[
                styles.deliveryText,
                currentStatus === 'delivered' && styles.deliveredText
              ]}>
                {getETA()}
              </Text>
            </View>
          </View>
          
          {/* Tracking Steps */}
          <View style={styles.trackingCard}>
            <Text style={styles.cardTitle}>Tracking Details</Text>
            
            <View style={styles.timeline}>
              {trackingSteps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isLast = index === trackingSteps.length - 1;
                
                // Skip if order is cancelled and step is not relevant
                if (currentStatus === 'cancelled' && step.id !== 'ordered' && step.id !== 'confirmed') {
                  return null;
                }
                
                return (
                  <View key={step.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View 
                        style={[
                          styles.timelineDot,
                          status === 'completed' && styles.completedDot,
                          status === 'current' && styles.currentDot,
                        ]}
                      >
                        <Ionicons 
                          name={status === 'completed' ? 'checkmark' : step.icon} 
                          size={16} 
                          color={status === 'upcoming' ? COLORS.textTertiary : COLORS.white} 
                        />
                      </View>
                      
                      {!isLast && (
                        <View 
                          style={[
                            styles.timelineLine,
                            status === 'completed' && styles.completedLine,
                          ]}
                        />
                      )}
                    </View>
                    
                    <View style={styles.timelineContent}>
                      <Text 
                        style={[
                          styles.timelineTitle,
                          status === 'completed' && styles.completedTitle,
                          status === 'current' && styles.currentTitle,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text 
                        style={[
                          styles.timelineDescription,
                          status === 'completed' && styles.completedDescription,
                          status === 'current' && styles.currentDescription,
                        ]}
                      >
                        {step.description}
                      </Text>
                      
                      {status === 'completed' && (
                        <Text style={styles.timelineTime}>
                          {formatDate(new Date(orderDetails.updatedAt || new Date()))}
                        </Text>
                      )}
                      
                      {status === 'current' && step.id === 'shipped' && (
                        <TouchableOpacity 
                          style={styles.trackButton}
                          onPress={() => {
                            // Navigate to detailed tracking map
                            navigation.navigate('LiveTracking', { orderId });
                          }}
                        >
                          <Text style={styles.trackButtonText}>Track Live Location</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
              
              {/* Show cancelled step if order is cancelled */}
              {currentStatus === 'cancelled' && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, styles.cancelledDot]}>
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </View>
                  </View>
                  
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineTitle, styles.cancelledTitle]}>
                      Order Cancelled
                    </Text>
                    <Text style={[styles.timelineDescription, styles.cancelledDescription]}>
                      Your order has been cancelled
                    </Text>
                    <Text style={styles.timelineTime}>
                      {formatDate(new Date(orderDetails.updatedAt || new Date()))}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          {/* Delivery Address */}
          <View style={styles.addressCard}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            
            <View style={styles.address}>
              <Ionicons name="location-outline" size={20} color={COLORS.text} style={styles.addressIcon} />
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>{orderDetails.deliveryAddress?.name || 'Delivery Address'}</Text>
                <Text style={styles.addressText}>
                  {orderDetails.deliveryAddress?.formattedAddress || 'Address information not available'}
                </Text>
                <Text style={styles.addressPhone}>{orderDetails.deliveryAddress?.phone || ''}</Text>
              </View>
            </View>
          </View>
          
          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            
            <View style={styles.itemsList}>
              {orderDetails.items?.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Image 
                    source={{ uri: item.product?.images?.[0]?.url || 'https://via.placeholder.com/60' }} 
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.priceDetails}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee</Text>
                <Text style={styles.priceValue}>₹{orderDetails.deliveryFee?.toFixed(2) || '0.00'}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tax</Text>
                <Text style={styles.priceValue}>₹{orderDetails.tax?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{orderDetails.total?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Need Help?"
              onPress={() => navigation.navigate('Support', { orderId })}
              variant="outline"
              fullWidth
              style={styles.supportButton}
            />
            
            {/* Show cancel button only if order is not delivered or cancelled */}
            {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
              <Button
                title="Cancel Order"
                onPress={() => {
                  // Show cancel confirmation
                  Alert.alert(
                    'Cancel Order',
                    'Are you sure you want to cancel this order?',
                    [
                      { 
                        text: 'No', 
                        style: 'cancel' 
                      },
                      { 
                        text: 'Yes', 
                        style: 'destructive',
                        onPress: () => {
                          // Call cancel order API
                          dispatch(cancelOrder(orderId));
                        }
                      }
                    ]
                  );
                }}
                variant="text"
                fullWidth
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <Button
            title="Back to Orders"
            onPress={() => navigation.navigate('Orders')}
            style={styles.backButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
  },
  orderDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radius / 2,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: SIZES.radius / 2,
  },
  deliveryText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  deliveredText: {
    color: COLORS.success,
  },
  trackingCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginVertical: 8,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginVertical: 8,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginVertical: 8,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeline: {
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  completedDot: {
    backgroundColor: COLORS.success,
  },
  currentDot: {
    backgroundColor: COLORS.primary,
  },
  cancelledDot: {
    backgroundColor: COLORS.error,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    position: 'absolute',
    top: 24,
    bottom: -24,
    left: 11,
    zIndex: 1,
  },
  completedLine: {
    backgroundColor: COLORS.success,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  completedTitle: {
    color: COLORS.success,
  },
  currentTitle: {
    color: COLORS.primary,
  },
  cancelledTitle: {
    color: COLORS.error,
  },
  timelineDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  completedDescription: {
    color: COLORS.textSecondary,
  },
  currentDescription: {
    color: COLORS.textSecondary,
  },
  cancelledDescription: {
    color: COLORS.textSecondary,
  },
  timelineTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  trackButton: {
    backgroundColor: COLORS.primary + '10',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  trackButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
  address: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  addressPhone: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  itemsList: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius / 2,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemQuantity: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  priceDetails: {
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  priceValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  totalLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
  },
  totalValue: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  actions: {
    padding: SIZES.padding,
    marginBottom: 24,
  },
  supportButton: {
    marginBottom: 12,
  },
  cancelButton: {
  },
  cancelButtonText: {
    color: COLORS.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    width: '80%',
  },
});

export default OrderTrackingScreen; 