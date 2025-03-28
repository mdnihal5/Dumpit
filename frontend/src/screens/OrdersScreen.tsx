import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../theme';

const OrdersScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>No orders yet</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
});

export default OrdersScreen; 