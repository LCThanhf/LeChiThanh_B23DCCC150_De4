import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Dish, Invoice } from '../types';

const DISHES_KEY = '@ban_an/dishes';
const INVOICES_KEY = '@ban_an/invoices';

type StoredData = {
  dishes: Dish[];
  invoices: Invoice[];
};

function parseArray<T>(raw: string | null): T[] | null {
  if (raw === null) {
    return null;
  }

  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as T[]) : null;
  } catch {
    return null;
  }
}

export async function loadRestaurantData(): Promise<StoredData | null> {
  const [rawDishes, rawInvoices] = await Promise.all([
    AsyncStorage.getItem(DISHES_KEY),
    AsyncStorage.getItem(INVOICES_KEY),
  ]);

  // Both keys missing means this is the first launch: let the app create seed data.
  if (rawDishes === null && rawInvoices === null) {
    return null;
  }

  return {
    dishes: parseArray<Dish>(rawDishes) ?? [],
    invoices: parseArray<Invoice>(rawInvoices) ?? [],
  };
}

export async function saveRestaurantData(data: StoredData): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(DISHES_KEY, JSON.stringify(data.dishes)),
    AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(data.invoices)),
  ]);
}
