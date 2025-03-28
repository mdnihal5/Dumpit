import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import Header from '../components/Header';
import { colors, typography, spacing } from '../utils/theme';
import commonStyles from '../utils/commonStyles';

// Use composite screen props to support both stack and tab navigation
type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Cart'>,
  BottomTabScreenProps<MainTabParamList, 'Cart'>
>;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Header title="My Cart" showBack={false} />
      <View style={styles.container}>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Browse our products and add items to your cart
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    fontWeight: 'normal' as TextStyle['fontWeight'],
    lineHeight: typography.body1.lineHeight,
    color: colors.darkGray,
    textAlign: 'center',
  },
});

export default CartScreen; 