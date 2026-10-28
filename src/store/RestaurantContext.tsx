import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createSeedData } from '../data/seed';
import { loadRestaurantData, saveRestaurantData } from '../storage';
import {
  INVOICE_PAID,
  INVOICE_SERVING,
} from '../types';
import type { Dish, DishInput, Invoice, InvoiceItem } from '../types';
import { formatDateTime } from '../utils/format';

type RestaurantContextValue = {
  ready: boolean;
  dishes: Dish[];
  invoices: Invoice[];
  occupiedTables: number[];
  addDish: (input: DishInput) => void;
  updateDish: (id: string, input: DishInput) => void;
  deleteDish: (id: string) => void;
  toggleDishAvailability: (id: string) => void;
  changeDishQuantity: (
    tableNumber: number,
    dishId: string,
    delta: number,
  ) => void;
  getActiveInvoiceForTable: (tableNumber: number) => Invoice | undefined;
  isDishInActiveInvoice: (dishId: string) => boolean;
  payInvoice: (invoiceId: string) => void;
};

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

type Props = {
  children: React.ReactNode;
};

export function RestaurantProvider({ children }: Props) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const stored = await loadRestaurantData();
        if (!isMounted) {
          return;
        }

        if (stored) {
          setDishes(stored.dishes);
          setInvoices(stored.invoices);
        } else {
          const seed = createSeedData();
          setDishes(seed.dishes);
          setInvoices(seed.invoices);
        }
      } catch (error) {
        console.warn('Không đọc được dữ liệu đã lưu.', error);
        if (isMounted) {
          const seed = createSeedData();
          setDishes(seed.dishes);
          setInvoices(seed.invoices);
        }
      } finally {
        if (isMounted) {
          setReady(true);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    saveRestaurantData({ dishes, invoices }).catch(error => {
      console.warn('Không lưu được dữ liệu.', error);
    });
  }, [dishes, invoices, ready]);

  const occupiedTables = useMemo(() => {
    const tables = invoices
      .filter(invoice => invoice.status === INVOICE_SERVING)
      .map(invoice => invoice.tableNumber);
    return Array.from(new Set(tables)).sort((a, b) => a - b);
  }, [invoices]);

  const addDish = (input: DishInput) => {
    setDishes(current => [
      ...current,
      {
        ...input,
        id: createId('dish'),
      },
    ]);
  };

  const updateDish = (id: string, input: DishInput) => {
    setDishes(current =>
      current.map(dish => (dish.id === id ? { ...dish, ...input } : dish)),
    );
  };

  const deleteDish = (id: string) => {
    setDishes(current => current.filter(dish => dish.id !== id));
  };

  const toggleDishAvailability = (id: string) => {
    setDishes(current =>
      current.map(dish =>
        dish.id === id ? { ...dish, available: !dish.available } : dish,
      ),
    );
  };

  const changeDishQuantity = (
    tableNumber: number,
    dishId: string,
    delta: number,
  ) => {
    if (delta > 0) {
      const dish = dishes.find(currentDish => currentDish.id === dishId);
      if (!dish?.available) {
        return;
      }
    }

    setInvoices(currentInvoices => {
      const activeInvoice = currentInvoices.find(
        invoice =>
          invoice.tableNumber === tableNumber &&
          invoice.status === INVOICE_SERVING,
      );

      if (!activeInvoice) {
        if (delta <= 0) {
          return currentInvoices;
        }

        const newInvoice: Invoice = {
          id: createId('invoice'),
          tableNumber,
          items: [{ dishId, quantity: Math.max(1, delta) }],
          status: INVOICE_SERVING,
          createdAt: formatDateTime(new Date()),
        };
        return [...currentInvoices, newInvoice];
      }

      const existingItem = activeInvoice.items.find(
        item => item.dishId === dishId,
      );
      const nextQuantity = (existingItem?.quantity ?? 0) + delta;

      let nextItems: InvoiceItem[];
      if (nextQuantity <= 0) {
        nextItems = activeInvoice.items.filter(
          item => item.dishId !== dishId,
        );
      } else if (existingItem) {
        nextItems = activeInvoice.items.map(item =>
          item.dishId === dishId
            ? { ...item, quantity: nextQuantity }
            : item,
        );
      } else {
        nextItems = [...activeInvoice.items, { dishId, quantity: nextQuantity }];
      }

      // An empty active invoice means the table is free again.
      if (nextItems.length === 0) {
        return currentInvoices.filter(
          invoice => invoice.id !== activeInvoice.id,
        );
      }

      return currentInvoices.map(invoice =>
        invoice.id === activeInvoice.id
          ? { ...invoice, items: nextItems }
          : invoice,
      );
    });
  };

  const getActiveInvoiceForTable = (tableNumber: number) => {
    return invoices.find(
      invoice =>
        invoice.tableNumber === tableNumber &&
        invoice.status === INVOICE_SERVING,
    );
  };

  const isDishInActiveInvoice = (dishId: string) => {
    return invoices.some(
      invoice =>
        invoice.status === INVOICE_SERVING &&
        invoice.items.some(item => item.dishId === dishId),
    );
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices(current =>
      current.map(invoice =>
        invoice.id === invoiceId
          ? { ...invoice, status: INVOICE_PAID }
          : invoice,
      ),
    );
  };

  const value: RestaurantContextValue = {
    ready,
    dishes,
    invoices,
    occupiedTables,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    changeDishQuantity,
    getActiveInvoiceForTable,
    isDishInActiveInvoice,
    payInvoice,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextValue {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant phải được dùng bên trong RestaurantProvider.');
  }
  return context;
}
