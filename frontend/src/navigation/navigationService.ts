import { createRef } from 'react';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from './types';

// Create a reference to the navigation object
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

/**
 * Navigate to a route in the app
 * @param name The route name
 * @param params The params to pass to the route
 */
export function navigate(name: keyof RootStackParamList, params?: any) {
  navigationRef.current?.navigate(name, params);
}

/**
 * Reset the navigation state to the given route
 * @param routes Array of routes to set as the new navigation state
 */
export function reset(routes: { name: keyof RootStackParamList; params?: any }[]) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: routes.length - 1,
      routes: routes.map(route => ({ name: route.name, params: route.params })),
    })
  );
}

/**
 * Reset navigation to the auth stack
 */
export function resetToAuth() {
  reset([{ name: 'Auth' }]);
}

/**
 * Reset navigation to the main stack
 */
export function resetToMain() {
  reset([{ name: 'Main' }]);
}

/**
 * Go back to the previous screen
 */
export function goBack() {
  navigationRef.current?.goBack();
}

export default {
  navigate,
  reset,
  resetToAuth,
  resetToMain,
  goBack,
};