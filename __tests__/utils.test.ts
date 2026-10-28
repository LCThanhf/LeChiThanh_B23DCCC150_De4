import type { Dish, Invoice } from '../src/types';
import {
  formatCurrency,
  formatDateTime,
  normalizeDigits,
} from '../src/utils/format';
import {
  getInvoiceItemCount,
  getInvoiceSubtotal,
  getInvoiceTotal,
  getVatAmount,
} from '../src/utils/invoice';

const dishes: Dish[] = [
  {
    id: 'dish-1',
    name: 'Phở bò',
    category: 'Món chính',
    price: 85000,
    available: true,
  },
  {
    id: 'dish-2',
    name: 'Trà đào',
    category: 'Đồ uống',
    price: 40000,
    available: true,
  },
];

const invoice: Invoice = {
  id: 'invoice-1',
  tableNumber: 3,
  items: [
    { dishId: 'dish-1', quantity: 2 },
    { dishId: 'dish-2', quantity: 1 },
  ],
  status: 'Đang phục vụ',
  createdAt: '18:30 28/10/2026',
};

describe('định dạng dữ liệu', () => {
  test('định dạng tiền theo kiểu Việt Nam', () => {
    expect(formatCurrency(45000)).toBe('45.000 đ');
    expect(formatCurrency(210000)).toBe('210.000 đ');
  });

  test('chuẩn hoá ô nhập số tiền', () => {
    expect(normalizeDigits('045.000')).toBe('45000');
    expect(normalizeDigits('abc12x3')).toBe('123');
  });

  test('định dạng ngày giờ hoá đơn', () => {
    expect(formatDateTime(new Date(2026, 9, 28, 18, 5))).toBe(
      '18:05 28/10/2026',
    );
  });
});

describe('tính tiền hoá đơn', () => {
  test('tạm tính, VAT và tổng cộng', () => {
    const subtotal = getInvoiceSubtotal(invoice, dishes);

    expect(subtotal).toBe(210000);
    expect(getVatAmount(subtotal)).toBe(16800);
    expect(getInvoiceTotal(subtotal)).toBe(226800);
  });

  test('đếm số phần đã gọi', () => {
    expect(getInvoiceItemCount(invoice)).toBe(3);
  });
});
