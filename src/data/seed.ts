import { INVOICE_SERVING } from '../types';
import type { Dish, Invoice } from '../types';
import { formatDateTime } from '../utils/format';

export const SEED_DISHES: Dish[] = [
  {
    id: 'dish-goi-cuon',
    name: 'Gỏi cuốn tôm thịt',
    category: 'Khai vị',
    price: 45000,
    available: true,
  },
  {
    id: 'dish-cha-gio',
    name: 'Chả giò rế',
    category: 'Khai vị',
    price: 55000,
    available: true,
  },
  {
    id: 'dish-sup-hai-san',
    name: 'Súp hải sản',
    category: 'Khai vị',
    price: 65000,
    available: false,
  },
  {
    id: 'dish-pho-bo',
    name: 'Phở bò đặc biệt',
    category: 'Món chính',
    price: 85000,
    available: true,
  },
  {
    id: 'dish-com-tam',
    name: 'Cơm tấm sườn nướng',
    category: 'Món chính',
    price: 75000,
    available: true,
  },
  {
    id: 'dish-bun-cha',
    name: 'Bún chả Hà Nội',
    category: 'Món chính',
    price: 70000,
    available: true,
  },
  {
    id: 'dish-ca-loc',
    name: 'Cá lóc kho tộ',
    category: 'Món chính',
    price: 95000,
    available: true,
  },
  {
    id: 'dish-che-ba-mau',
    name: 'Chè ba màu',
    category: 'Tráng miệng',
    price: 30000,
    available: true,
  },
  {
    id: 'dish-banh-flan',
    name: 'Bánh flan caramel',
    category: 'Tráng miệng',
    price: 35000,
    available: true,
  },
  {
    id: 'dish-tra-dao',
    name: 'Trà đào cam sả',
    category: 'Đồ uống',
    price: 40000,
    available: true,
  },
  {
    id: 'dish-nuoc-ep-dua',
    name: 'Nước ép dứa',
    category: 'Đồ uống',
    price: 35000,
    available: true,
  },
  {
    id: 'dish-ca-phe-sua',
    name: 'Cà phê sữa đá',
    category: 'Đồ uống',
    price: 30000,
    available: true,
  },
];

export function createSeedInvoices(): Invoice[] {
  const minutesAgo = (minutes: number) =>
    formatDateTime(new Date(Date.now() - minutes * 60 * 1000));

  return [
    {
      id: 'invoice-seed-1',
      tableNumber: 3,
      items: [
        { dishId: 'dish-pho-bo', quantity: 2 },
        { dishId: 'dish-tra-dao', quantity: 1 },
      ],
      status: INVOICE_SERVING,
      createdAt: minutesAgo(35),
    },
    {
      id: 'invoice-seed-2',
      tableNumber: 6,
      items: [
        { dishId: 'dish-com-tam', quantity: 1 },
        { dishId: 'dish-bun-cha', quantity: 1 },
        { dishId: 'dish-ca-phe-sua', quantity: 2 },
      ],
      status: INVOICE_SERVING,
      createdAt: minutesAgo(58),
    },
    {
      id: 'invoice-seed-3',
      tableNumber: 8,
      items: [
        { dishId: 'dish-goi-cuon', quantity: 1 },
        { dishId: 'dish-banh-flan', quantity: 2 },
        { dishId: 'dish-nuoc-ep-dua', quantity: 1 },
      ],
      status: INVOICE_SERVING,
      createdAt: minutesAgo(82),
    },
  ];
}

export function createSeedData(): { dishes: Dish[]; invoices: Invoice[] } {
  return {
    dishes: SEED_DISHES.map(dish => ({ ...dish })),
    invoices: createSeedInvoices(),
  };
}
