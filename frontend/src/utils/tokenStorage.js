import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing token:', error);
    return false;
  }
};

export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}; 