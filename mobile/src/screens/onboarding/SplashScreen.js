import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, checkOnboardingStatus } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);
  
  useEffect(() => {
    // Animate the logo fade-in and scaling
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Check onboarding and authentication status
    const checkAppState = async () => {
      try {
        // Check if onboarding has been completed
        await dispatch(checkOnboardingStatus()).unwrap();
        
        // Check if user is logged in
        await dispatch(getCurrentUser()).unwrap();
        
        // Wait for animation to finish
        setTimeout(() => {
          // Navigate based on onboarding and authentication status
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }, 2000);
      } catch (error) {
        // Check onboarding status manually if the Redux action fails
        const hasOnboarded = await AsyncStorage.getItem('HAS_ONBOARDED');
        
        // Wait for animation to finish
        setTimeout(() => {
          if (hasOnboarded === 'true') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }, 2000);
      }
    };
    
    checkAppState();
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { opacity, transform: [{ scale }] }
        ]}
      >
        <Text style={styles.logoText}>DumpIt</Text>
        <Text style={styles.tagline}>Construction Materials Delivered Fast</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    ...TYPOGRAPHY.heading,
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});

export default SplashScreen; 