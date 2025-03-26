import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';
import Card from './Card';

/**
 * VendorCard component for displaying vendor information
 * 
 * @param {Object} props
 * @param {Object} props.vendor - Vendor data
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Object} props.style - Additional style for the card
 */
const VendorCard = ({
  vendor,
  onPress,
  style,
}) => {
  if (!vendor) return null;

  const {
    businessName,
    logo,
    categories = [],
    averageRating,
    isOpen,
    deliveryRadius,
  } = vendor;

  const logoUrl = logo || 'https://via.placeholder.com/150';
  const formattedCategories = categories.slice(0, 2).join(', ');
  const showMoreCategories = categories.length > 2;

  return (
    <Card 
      onPress={onPress} 
      style={[styles.container, style]}
    >
      <Image 
        source={{ uri: logoUrl }} 
        style={styles.logo}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{businessName}</Text>
          <View style={[
            styles.statusBadge, 
            isOpen ? styles.openBadge : styles.closedBadge
          ]}>
            <Text style={styles.statusText}>{isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
        
        <Text style={styles.categories} numberOfLines={1}>
          {formattedCategories}{showMoreCategories ? ' +more' : ''}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {averageRating?.toFixed(1) || 'N/A'}</Text>
          </View>
          
          {deliveryRadius && (
            <Text style={styles.delivery}>
              Delivers within {deliveryRadius} km
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  openBadge: {
    backgroundColor: COLORS.success,
  },
  closedBadge: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '500',
  },
  categories: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
    fontWeight: '500',
  },
  delivery: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
});

export default VendorCard; 