import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { enableTwoFactorAuth, disableTwoFactorAuth, verifyTwoFactorCode } from '../../store/slices/userSlice';
import QRCode from 'react-native-qrcode-svg';

const TwoFactorAuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { twoFactorEnabled, twoFactorSecret } = useSelector((state) => state.user);
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnable2FA = async () => {
    try {
      await dispatch(enableTwoFactorAuth());
      setShowQRCode(true);
      Alert.alert(
        'Two-Factor Authentication',
        'Please scan the QR code with your authenticator app and enter the verification code.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to enable two-factor authentication');
    }
  };

  const handleDisable2FA = () => {
    Alert.alert(
      'Disable Two-Factor Authentication',
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disable',
          onPress: async () => {
            try {
              await dispatch(disableTwoFactorAuth());
              Alert.alert('Success', 'Two-factor authentication disabled');
            } catch (error) {
              Alert.alert('Error', 'Failed to disable two-factor authentication');
            }
          },
        },
      ]
    );
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    try {
      await dispatch(verifyTwoFactorCode(verificationCode));
      Alert.alert('Success', 'Two-factor authentication enabled successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderQRCode = () => (
    <View style={styles.qrContainer}>
      <QRCode
        value={twoFactorSecret}
        size={200}
      />
      <Text style={styles.secretKey}>
        Manual Entry Key: {twoFactorSecret}
      </Text>
      <Text style={styles.qrInstructions}>
        Scan this QR code with your authenticator app or manually enter the key
      </Text>
    </View>
  );

  const renderVerificationForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Enter Verification Code</Text>
      <Input
        label="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        maxLength={6}
      />
      <Button
        title="Verify"
        onPress={handleVerifyCode}
        loading={isVerifying}
      />
    </View>
  );

  const renderSetupInstructions = () => (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsTitle}>How to Set Up 2FA</Text>
      <View style={styles.instructionStep}>
        <Text style={styles.stepNumber}>1</Text>
        <Text style={styles.stepText}>
          Download an authenticator app like Google Authenticator or Authy
        </Text>
      </View>
      <View style={styles.instructionStep}>
        <Text style={styles.stepNumber}>2</Text>
        <Text style={styles.stepText}>
          Scan the QR code or manually enter the secret key
        </Text>
      </View>
      <View style={styles.instructionStep}>
        <Text style={styles.stepNumber}>3</Text>
        <Text style={styles.stepText}>
          Enter the 6-digit code from your authenticator app
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Two-Factor Authentication</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Two-factor authentication adds an extra layer of security to your
            account by requiring both your password and a verification code from
            your authenticator app.
          </Text>

          {!twoFactorEnabled ? (
            <>
              {renderSetupInstructions()}
              {showQRCode && renderQRCode()}
              {showQRCode && renderVerificationForm()}
              {!showQRCode && (
                <Button
                  title="Enable Two-Factor Authentication"
                  onPress={handleEnable2FA}
                />
              )}
            </>
          ) : (
            <View style={styles.enabledContainer}>
              <Icon name="shield-check" size={48} color={COLORS.success} />
              <Text style={styles.enabledText}>
                Two-Factor Authentication is enabled
              </Text>
              <Button
                title="Disable Two-Factor Authentication"
                variant="outline"
                onPress={handleDisable2FA}
                color={COLORS.error}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.medium,
  },
  title: {
    fontSize: FONTS.size.h2,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.large,
  },
  description: {
    fontSize: FONTS.size.h4,
    color: COLORS.secondary,
    marginBottom: SPACING.large,
  },
  instructionsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.large,
  },
  instructionsTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.medium,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: SPACING.medium,
    fontSize: FONTS.size.h5,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: FONTS.size.h4,
    color: COLORS.secondary,
  },
  qrContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  secretKey: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginTop: SPACING.medium,
    textAlign: 'center',
  },
  qrInstructions: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginTop: SPACING.medium,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
  },
  formTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  enabledContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
  },
  enabledText: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginTop: SPACING.medium,
    marginBottom: SPACING.large,
  },
});

export default TwoFactorAuthScreen; 