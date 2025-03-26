import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Typography, SPACING } from '../styles';

/**
 * Loader component to display loading state
 * @param {object} props - Component props
 * @param {string} props.text - Text to display below loader
 * @param {string} props.size - Size of the activity indicator ('small' or 'large')
 * @param {string} props.color - Color of the activity indicator
 * @param {boolean} props.fullScreen - Whether the loader should take up the full screen
 * @param {object} props.style - Additional style for the container
 */
const Loader = ({
  text,
  size = 'large',
  color = Colors.PRIMARY,
  fullScreen = true,
  style
}) => {
  return (
    <View style={[
      styles.container, 
      fullScreen ? styles.fullScreen : null,
      style
    ]}>
      <ActivityIndicator size={size} color={color} />
      
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.LARGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BACKGROUND.PRIMARY,
    zIndex: 10,
  },
  text: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    marginTop: SPACING.MEDIUM,
  },
});

export default Loader; 