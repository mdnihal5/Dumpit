import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles';
import Card from './Card';
import { cloudinaryOptimize } from '../utils/config';
import { DEFAULT_AVATAR } from '../config';

const VendorCard = ({
  vendor,
  onPress,
  horizontal = false,
  style,
  imageStyle,
  width = horizontal ? '100%' : 180,
  compact = false,
  ...props
}) => {
  if (!vendor) return null;

  const {
    name,
    logo,
    coverImage,
    category,
    description,
    rating,
    reviewCount,
    address,
    featured,
    distance,
    productCount,
    categories = [],
  } = vendor;

  const imageUrl = logo || DEFAULT_AVATAR;
  
  // Format distance to show in km with 1 decimal point
  const formattedDistance = distance ? 
    `${distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(1) + 'km'}` : 
    null;
  
  // Get first 2 categories for display
  const displayCategories = categories.slice(0, 2).map(c => c.name).join(', ');
  
  const renderRating = () => {
    if (!rating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={16} color={Colors.WARNING} />
        <Text style={styles.rating}>
          {rating.toFixed(1)} {reviewCount ? `(${reviewCount})` : ''}
        </Text>
      </View>
    );
  };

  if (horizontal) {
    return (
      <Card 
        onPress={onPress} 
        style={[styles.horizontalContainer, { width }, style]}
        shadowLevel="small"
      >
        <View style={styles.horizontalContent}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.horizontalImage, imageStyle]}
            resizeMode="cover"
          />
          
          <View style={styles.horizontalDetails}>
            <View style={styles.nameContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {name}
              </Text>
              {featured && (
                <View style={styles.featuredBadge}>
                  <MaterialIcons name="verified" size={16} color={Colors.PRIMARY} />
                </View>
              )}
            </View>
            
            {displayCategories && (
              <Text style={styles.category}>
                {displayCategories}
              </Text>
            )}
            
            {renderRating()}
            
            {address?.city && (
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={14} color={Colors.GRAY_DARK} />
                <Text numberOfLines={1} style={styles.location}>
                  {address.city}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact ? styles.compactContainer : null,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {/* Vendor Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      
      {/* Vendor Info */}
      <View style={styles.infoContainer}>
        {/* Vendor name */}
        <Text style={styles.vendorName} numberOfLines={1}>
          {name}
        </Text>
        
        {/* Categories if available */}
        {displayCategories && (
          <Text style={styles.categories} numberOfLines={1}>
            {displayCategories}
          </Text>
        )}
        
        {/* Bottom row with ratings and distance */}
        <View style={styles.bottomRow}>
          {/* Ratings if available */}
          {renderRating()}
          
          {/* Distance if available */}
          {formattedDistance && (
            <Text style={styles.distance}>{formattedDistance}</Text>
          )}
        </View>
      </View>
      
      {/* Product count badge */}
      {productCount > 0 && (
        <View style={styles.productCountContainer}>
          <Text style={styles.productCount}>{productCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    borderRadius: BorderRadius.MEDIUM,
    overflow: 'hidden',
    marginBottom: Spacing.MEDIUM,
    padding: Spacing.SMALL,
    ...Shadows.SMALL,
  },
  compactContainer: {
    padding: Spacing.XSMALL,
  },
  logoContainer: {
    marginRight: Spacing.SMALL,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.MEDIUM,
    backgroundColor: Colors.BACKGROUND.SECONDARY,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vendorName: {
    ...Typography.BODY,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.TINY,
  },
  categories: {
    ...Typography.BODY_SMALL,
    color: Colors.TEXT_TERTIARY,
    marginBottom: Spacing.XSMALL,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...Typography.BODY_SMALL,
    color: Colors.TEXT_SECONDARY,
    marginRight: Spacing.TINY,
  },
  distance: {
    ...Typography.BODY_SMALL,
    color: Colors.TEXT_TERTIARY,
  },
  productCountContainer: {
    position: 'absolute',
    top: Spacing.XSMALL,
    right: Spacing.XSMALL,
    backgroundColor: Colors.PRIMARY,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCount: {
    ...Typography.BODY_SMALL,
    color: Colors.TEXT_INVERSE,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  horizontalContainer: {
    overflow: 'hidden',
    margin: Spacing.SMALL,
  },
  horizontalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.SMALL,
    margin: Spacing.SMALL,
  },
  horizontalDetails: {
    flex: 1,
    padding: Spacing.SMALL,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.BODY,
    fontWeight: Typography.FONT_WEIGHT_MEDIUM,
    color: Colors.TEXT_PRIMARY,
    flex: 1,
  },
  featuredBadge: {
    marginLeft: Spacing.TINY,
  },
});

export default VendorCard; 