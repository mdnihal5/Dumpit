import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Colors
export const COLORS = {
  // Primary
  primary: '#3E7BFA',
  primaryLight: '#6F9EFF',
  primaryDark: '#2C5CBC',
  
  // Secondary
  secondary: '#FF8A3D',
  secondaryLight: '#FFA76C',
  secondaryDark: '#E06A1E',
  
  // Accent
  accent: '#00C897',
  
  // Status
  success: '#00C897',
  info: '#3E7BFA',
  warning: '#FF8A3D',
  error: '#FF5757',
  
  // Grayscale
  white: '#FFFFFF',
  background: '#F8F9FA',
  border: '#E9ECEF',
  inputBg: '#F1F3F5',
  
  // Text
  text: '#212529',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textLight: '#F8F9FA',
  
  // Special
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Typography
export const TYPOGRAPHY = {
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
  h1: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'bold',
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  h6: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
  },
};

// Sizing and spacing
export const SIZES = {
  // Screen dimensions
  width,
  height,
  
  // Spacing
  padding: 16,
  margin: 16,
  
  // Border radius
  radius: 8,
  radiusSm: 4,
  radiusLg: 12,
  
  // Icons
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,
}; 