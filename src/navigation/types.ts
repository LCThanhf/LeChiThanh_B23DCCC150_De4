export type RootStackParamList = {
  Tables: undefined;
  Menu: undefined;
  DishForm: { dishId?: string } | undefined;
  Order: { tableNumber: number };
  Payment: { invoiceId: string };
};
