import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleUpdateProfile = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <Icon name="camera" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );

  const renderProfileForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Information</Text>
      <View style={styles.form}>
        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          editable={isEditing}
        />
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          editable={isEditing}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          editable={isEditing}
          keyboardType="phone-pad"
        />
        {isEditing ? (
          <Button title="Save Changes" onPress={handleUpdateProfile} />
        ) : (
          <Button
            title="Edit Profile"
            variant="outline"
            onPress={() => setIsEditing(true)}
          />
        )}
      </View>
    </View>
  );

  const renderOrderHistory = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Order History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {orders.slice(0, 3).map((order) => (
        <TouchableOpacity
          key={order._id}
          style={styles.orderCard}
          onPress={() => navigation.navigate('OrderDetails', { order })}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderStatus}>{order.status}</Text>
            <Text style={styles.orderTotal}>₹{order.total}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Addresses')}
        >
          <Icon name="map-marker" size={24} color={COLORS.primary} />
          <Text style={styles.settingText}>Manage Addresses</Text>
          <Icon name="chevron-right" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell" size={24} color={COLORS.primary} />
          <Text style={styles.settingText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Icon name="shield-lock" size={24} color={COLORS.primary} />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Icon name="chevron-right" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Help')}
        >
          <Icon name="help-circle" size={24} color={COLORS.primary} />
          <Text style={styles.settingText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderProfileHeader()}
        {renderProfileForm()}
        {renderOrderHistory()}
        {renderSettings()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          color={COLORS.error}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.large,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FONTS.size.h2,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  email: {
    fontSize: FONTS.size.h4,
    color: COLORS.secondary,
  },
  section: {
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  sectionTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: FONTS.size.h4,
    color: COLORS.primary,
  },
  form: {
    gap: SPACING.medium,
  },
  orderCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  orderNumber: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: FONTS.size.h5,
    color: COLORS.primary,
  },
  orderTotal: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
  },
  settingsList: {
    gap: SPACING.medium,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
  },
  settingText: {
    flex: 1,
    fontSize: FONTS.size.h4,
    marginLeft: SPACING.medium,
  },
  footer: {
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default ProfileScreen; 