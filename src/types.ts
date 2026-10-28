export const CATEGORIES = [
  'Khai vị',
  'Món chính',
  'Tráng miệng',
  'Đồ uống',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const INVOICE_SERVING = 'Đang phục vụ';
export const INVOICE_PAID = 'Đã thanh toán';

export type InvoiceStatus = typeof INVOICE_SERVING | typeof INVOICE_PAID;

export type Dish = {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
};

export type DishInput = Omit<Dish, 'id'>;

export type InvoiceItem = {
  dishId: string;
  quantity: number;
};

export type Invoice = {
  id: string;
  tableNumber: number;
  items: InvoiceItem[];
  status: InvoiceStatus;
  createdAt: string;
};
