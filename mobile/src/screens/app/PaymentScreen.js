import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { Button, Header } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateOrderPayment } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';

const PaymentScreen = ({ route, navigation }) => {
  const { order, amount, paymentMethod } = route.params;
  const dispatch = useDispatch();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/[^0-9]/gi, '');
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Validate card details
  const validateCard = () => {
    const newErrors = {};
    
    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = 'Please enter card holder name';
    }
    
    if (!expiryDate.trim() || expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (
        parseInt(month) < 1 || 
        parseInt(month) > 12 || 
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cvv.trim() || cvv.length !== 3) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate UPI ID
  const validateUPI = () => {
    const newErrors = {};
    
    if (!upiId.trim() || !upiId.includes('@')) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process payment
  const handlePayment = async () => {
    try {
      // Validate based on payment method
      let isValid = false;
      
      if (paymentMethod === 'card') {
        isValid = validateCard();
      } else if (paymentMethod === 'upi') {
        isValid = validateUPI();
      }
      
      if (!isValid) return;
      
      setLoading(true);
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const paymentResult = {
        success: true,
        transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
        paymentDate: new Date().toISOString(),
      };
      
      // Update order with payment info
      await dispatch(updateOrderPayment({
        orderId: order._id,
        paymentInfo: paymentResult
      })).unwrap();
      
      // Clear cart
      dispatch(clearCart());
      
      // Navigate to success screen
      navigation.replace('OrderSuccess', { order: { ...order, paymentInfo: paymentResult } });
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error?.message || 'Failed to process payment. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment" onBack={() => navigation.goBack()} />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amount}>₹{amount.toFixed(2)}</Text>
          <Text style={styles.orderId}>Order ID: {order._id}</Text>
        </View>
        
        {paymentMethod === 'card' ? (
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Credit/Debit Card</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              />
              {errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Holder Name</Text>
              <TextInput
                style={[styles.input, errors.cardHolderName && styles.inputError]}
                placeholder="John Doe"
                value={cardHolderName}
                onChangeText={setCardHolderName}
              />
              {errors.cardHolderName && (
                <Text style={styles.errorText}>{errors.cardHolderName}</Text>
              )}
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                />
                {errors.expiryDate && (
                  <Text style={styles.errorText}>{errors.expiryDate}</Text>
                )}
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cvv}
                  onChangeText={setCvv}
                  secureTextEntry
                />
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.upiContainer}>
            <Text style={styles.cardTitle}>UPI Payment</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>UPI ID</Text>
              <TextInput
                style={[styles.input, errors.upiId && styles.inputError]}
                placeholder="yourname@upi"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
              {errors.upiId && (
                <Text style={styles.errorText}>{errors.upiId}</Text>
              )}
            </View>
            
            <Text style={styles.upiHelp}>
              Enter your UPI ID (e.g., yourname@paytm, yourname@okaxis)
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={loading ? "Processing..." : "Pay Now"}
          onPress={handlePayment}
          disabled={loading}
          fullWidth
        />
        
        <Text style={styles.securityNote}>
          <Ionicons name="lock-closed" size={14} color={COLORS.textSecondary} /> 
          Your payment information is secure
        </Text>
      </View>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Processing Payment...</Text>
          </View>
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
  contentContainer: {
    padding: SIZES.padding,
  },
  amountContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  amount: {
    ...TYPOGRAPHY.heading,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 8,
  },
  orderId: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
  },
  upiContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  upiHelp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  securityNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    width: '80%',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginTop: 16,
  },
});

export default PaymentScreen; 