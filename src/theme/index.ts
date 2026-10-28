import type { TextStyle, ViewStyle } from 'react-native';
import type { Category } from '../types';

export const colors = {
  background: '#F2F6F9',
  surface: '#FFFFFF',
  surfaceAlt: '#E9F0F5',
  primary: '#2C6E8F',
  primaryDark: '#1B4E68',
  primarySoft: '#E1EEF5',
  primarySoftPressed: '#CEE2ED',
  text: '#152731',
  textSecondary: '#4E6473',
  textMuted: '#748B99',
  border: '#DEE8EF',
  borderStrong: '#C7D6E0',
  success: '#2C8465',
  successSoft: '#E3F2EC',
  danger: '#C0433A',
  dangerSoft: '#FBEAE8',
  soldOut: '#5A7386',
  soldOutSoft: '#E4EDF2',
  white: '#FFFFFF',
  overlay: 'rgba(14, 31, 41, 0.38)',
  shadow: '#1D3849',
} as const;

export const categoryAccents: Record<Category, string> = {
  'Khai vị': '#2E8B72',
  'Món chính': '#2C6E8F',
  'Tráng miệng': '#7B61A8',
  'Đồ uống': '#4E9DB5',
};

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  title: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: 16.5,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  small: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
} satisfies Record<string, TextStyle>;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
} satisfies Record<string, ViewStyle>;

export const layout = {
  screenPadding: 20,
} as const;
