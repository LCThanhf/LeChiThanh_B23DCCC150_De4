export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeDigits(value: string, maxLength = 9): string {
  const digits = digitsOnly(value).replace(/^0+(?=\d)/, '');
  return digits.slice(0, maxLength);
}

export function formatThousands(value: number | string): string {
  const digits = digitsOnly(String(value));
  if (!digits) {
    return '';
  }
  return digits
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatCurrency(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}${formatThousands(Math.abs(rounded))} đ`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(
    date.getDate(),
  )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTableNumber(tableNumber: number): string {
  return pad(tableNumber);
}
