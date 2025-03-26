import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Colors, Typography, SPACING } from '../styles';

/**
 * Empty state component to display when there's no data
 * @param {object} props - Component props
 * @param {string} props.title - Title text to display
 * @param {string} props.message - Message text to display
 * @param {React.ReactNode} props.icon - Custom icon or component to display
 * @param {object} props.style - Additional style for the container
 * @param {object} props.titleStyle - Additional style for the title
 * @param {object} props.messageStyle - Additional style for the message
 */
const Empty = ({
  title = 'Nothing to See Here',
  message = 'There are no items to display right now.',
  icon,
  style,
  titleStyle,
  messageStyle
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {icon || <Feather name="inbox" size={60} color={Colors.TEXT.SECONDARY} />}
      </View>
      
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>
      
      <Text style={[styles.message, messageStyle]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LARGE,
  },
  iconContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  title: {
    ...Typography.TYPOGRAPHY.H3,
    color: Colors.TEXT.PRIMARY,
    marginBottom: SPACING.SMALL,
    textAlign: 'center',
  },
  message: {
    ...Typography.TYPOGRAPHY.BODY,
    color: Colors.TEXT.SECONDARY,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default Empty; 