import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { updatePrivacySettings, updatePassword } from '../../store/slices/userSlice';
import { logout } from '../../store/slices/authSlice';

const PrivacyScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { privacySettings } = useSelector((state) => state.user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleSetting = (setting) => {
    dispatch(updatePrivacySettings({ [setting]: !privacySettings[setting] }));
  };

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    dispatch(updatePassword(passwordData));
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    Alert.alert('Success', 'Password updated successfully');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderPrivacySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Privacy Settings</Text>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Profile Visibility</Text>
          <Text style={styles.settingDescription}>
            Allow other users to view your profile
          </Text>
        </View>
        <Switch
          value={privacySettings.profileVisibility}
          onValueChange={() => handleToggleSetting('profileVisibility')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Order History</Text>
          <Text style={styles.settingDescription}>
            Show order history to other users
          </Text>
        </View>
        <Switch
          value={privacySettings.orderHistory}
          onValueChange={() => handleToggleSetting('orderHistory')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Location Services</Text>
          <Text style={styles.settingDescription}>
            Allow app to access your location
          </Text>
        </View>
        <Switch
          value={privacySettings.locationServices}
          onValueChange={() => handleToggleSetting('locationServices')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>
    </View>
  );

  const renderSecuritySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security Settings</Text>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setShowPasswordModal(true)}
      >
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Change Password</Text>
          <Text style={styles.settingDescription}>
            Update your account password
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate('TwoFactorAuth')}
      >
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
          <Text style={styles.settingDescription}>
            Add an extra layer of security
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate('LoginHistory')}
      >
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Login History</Text>
          <Text style={styles.settingDescription}>
            View your recent login activity
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderAccountSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <TouchableOpacity
        style={[styles.settingItem, styles.dangerItem]}
        onPress={() => setShowDeleteModal(true)}
      >
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, styles.dangerText]}>
            Delete Account
          </Text>
          <Text style={styles.settingDescription}>
            Permanently delete your account
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
            >
              <Icon name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalForm}>
            <Input
              label="Current Password"
              value={passwordData.currentPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, currentPassword: text })
              }
              secureTextEntry
              placeholder="Enter your current password"
            />
            <Input
              label="New Password"
              value={passwordData.newPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, newPassword: text })
              }
              secureTextEntry
              placeholder="Enter your new password"
            />
            <Input
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, confirmPassword: text })
              }
              secureTextEntry
              placeholder="Confirm your new password"
            />
          </View>

          <View style={styles.modalFooter}>
            <Button title="Update Password" onPress={handleUpdatePassword} />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal
      visible={showDeleteModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
            >
              <Icon name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.deleteWarning}>
              Are you sure you want to delete your account? This action cannot be
              undone.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              color={COLORS.error}
            />
          </View>
        </View>
      </View>
    </Modal>
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
        <Text style={styles.title}>Privacy & Security</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderPrivacySettings()}
        {renderSecuritySettings()}
        {renderAccountSettings()}
      </ScrollView>

      {renderPasswordModal()}
      {renderDeleteModal()}
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
  section: {
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.medium,
  },
  settingLabel: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  settingDescription: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
  },
  dangerItem: {
    backgroundColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginTop: SPACING.medium,
  },
  dangerText: {
    color: COLORS.error,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: SPACING.large,
  },
  modalBody: {
    padding: SPACING.large,
  },
  deleteWarning: {
    fontSize: FONTS.size.h4,
    color: COLORS.error,
    textAlign: 'center',
  },
  modalFooter: {
    padding: SPACING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default PrivacyScreen; 