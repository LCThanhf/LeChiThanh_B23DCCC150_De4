import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { RestaurantProvider } from './src/store/RestaurantContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RestaurantProvider>
        <RootNavigator />
      </RestaurantProvider>
    </SafeAreaProvider>
  );
}
