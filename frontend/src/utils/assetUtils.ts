/**
 * Utility functions for handling assets in the app
 */

import { API_URL } from '@env';

// Fallback local product images when API doesn't return any
export const fallbackProductImages = [
  require('../assets/images/products/product1.jpg'),
  require('../assets/images/products/product2.jpg'),
  require('../assets/images/products/product3.jpg'),
];

// Default avatar image when user doesn't have one
export const defaultAvatar = require('../assets/images/default-avatar.png');

/**
 * Get a product image with fallback to local images
 * @param imageUrl API image URL
 * @param index Optional index to select a specific fallback image
 * @returns Image source that can be used directly in <Image source={getProductImage(url)} />
 */
export const getProductImage = (imageUrl?: string, index?: number): any => {
  if (imageUrl) {
    return { uri: imageUrl };
  }
  
  // Use specific fallback image if index is provided
  if (typeof index === 'number' && index >= 0 && index < fallbackProductImages.length) {
    return fallbackProductImages[index];
  }
  
  // Use random fallback image
  const randomIndex = Math.floor(Math.random() * fallbackProductImages.length);
  return fallbackProductImages[randomIndex];
};

/**
 * Get a list of images with fallbacks based on a product
 * @param product Product object with optional images array
 * @param count Number of images to return
 */
export const getProductImages = (product: any, count = 1): any[] => {
  if (product?.images?.length) {
    return product.images.map((img: string) => ({ uri: img }));
  }
  
  // Return appropriate number of fallback images
  return Array(count)
    .fill(0)
    .map((_, index) => {
      const imgIndex = index % fallbackProductImages.length;
      return fallbackProductImages[imgIndex];
    });
};

/**
 * Get user avatar with fallback
 * @param avatarPath - The avatar path from the user object
 * @returns A fully qualified URL or default image source
 */
export const getUserAvatar = (avatarPath: string): any => {
  if (!avatarPath) {
    // Return a default avatar image
    return require('../assets/images/default-avatar.png');
  }

  // Check if it's a full URL or a relative path
  if (avatarPath.startsWith('http')) {
    return { uri: avatarPath };
  }

  // It's a relative path, so prefix with API_URL
  return { uri: `${API_URL}${avatarPath}` };
};

/**
 * Creates a FormData object for image upload
 * @param uri - The local URI of the image file
 * @param fieldName - The form field name (default: 'avatar')
 * @returns FormData object ready for upload
 */
export const createImageFormData = (uri: string, fieldName = 'avatar'): FormData => {
  const formData = new FormData();
  const fileType = uri.substring(uri.lastIndexOf('.') + 1);
  
  // @ts-ignore - FormData accepts this structure but TypeScript doesn't recognize it
  formData.append(fieldName, {
    uri,
    name: `${fieldName}.${fileType}`,
    type: `image/${fileType}`,
  });
  
  return formData;
}; 