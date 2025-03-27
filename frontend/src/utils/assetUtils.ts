/**
 * Utility functions for handling assets in the app
 */

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
 * @param avatarUrl Avatar URL from user object
 * @returns Image source for the avatar
 */
export const getUserAvatar = (avatarUrl?: string): any => {
  if (avatarUrl) {
    return { uri: avatarUrl };
  }
  return defaultAvatar;
}; 