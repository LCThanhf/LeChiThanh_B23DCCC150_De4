import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '../store/RestaurantContext';
import { colors, radius, typography } from '../theme';
import DishFormScreen from '../screens/DishFormScreen';
import MenuScreen from '../screens/MenuScreen';
import OrderScreen from '../screens/OrderScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TablesScreen from '../screens/TablesScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

function LoadingScreen() {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <View style={styles.loadingMark}>
        <Text style={styles.loadingLetter}>B</Text>
      </View>
      <ActivityIndicator color={colors.primary} style={styles.loadingSpinner} />
      <Text style={styles.loadingText}>Đang chuẩn bị thực đơn…</Text>
    </SafeAreaView>
  );
}

export default function RootNavigator() {
  const { ready } = useRestaurant();

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Tables" component={TablesScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen
          name="DishForm"
          component={DishFormScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMark: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLetter: {
    ...typography.display,
    fontSize: 30,
    color: colors.white,
  },
  loadingSpinner: {
    marginTop: 24,
  },
  loadingText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
