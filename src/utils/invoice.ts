import { VAT_RATE } from '../constants';
import type { Dish, Invoice } from '../types';

export type InvoiceLine = {
  dish: Dish;
  quantity: number;
  lineTotal: number;
};

export function getInvoiceLines(
  invoice: Invoice | undefined,
  dishes: Dish[],
): InvoiceLine[] {
  if (!invoice) {
    return [];
  }

  return invoice.items.reduce<InvoiceLine[]>((lines, item) => {
    const dish = dishes.find(currentDish => currentDish.id === item.dishId);
    if (dish) {
      lines.push({
        dish,
        quantity: item.quantity,
        lineTotal: dish.price * item.quantity,
      });
    }
    return lines;
  }, []);
}

export function getInvoiceSubtotal(
  invoice: Invoice | undefined,
  dishes: Dish[],
): number {
  return getInvoiceLines(invoice, dishes).reduce(
    (total, line) => total + line.lineTotal,
    0,
  );
}

export function getInvoiceItemCount(invoice: Invoice | undefined): number {
  if (!invoice) {
    return 0;
  }
  return invoice.items.reduce((total, item) => total + item.quantity, 0);
}

export function getVatAmount(subtotal: number): number {
  return Math.round(subtotal * VAT_RATE);
}

export function getInvoiceTotal(subtotal: number): number {
  return subtotal + getVatAmount(subtotal);
}
