import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { 
  AuthStackParamList, 
  MainStackParamList, 
  RootStackParamList 
} from '../navigation/types';
import { MainTabParamList } from '../navigation/MainTabNavigator';

// Re-export the param lists
export { AuthStackParamList, MainStackParamList, RootStackParamList };

// Navigation prop types for each navigation context
export type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// Combined navigation type for tab screens (used in MainTabNavigator screens)
export type MainScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

// Root navigation type (used in App.tsx)
export type RootScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>; 