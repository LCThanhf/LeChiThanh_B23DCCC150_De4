import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import type { RootStackParamList } from '../navigation/types';
import { useRestaurant } from '../store/RestaurantContext';
import {
  colors,
  layout,
  radius,
  shadows,
  typography,
} from '../theme';
import { INVOICE_SERVING } from '../types';
import {
  formatCurrency,
  formatTableNumber,
  formatThousands,
  normalizeDigits,
} from '../utils/format';
import {
  getInvoiceLines,
  getInvoiceTotal,
  getVatAmount,
} from '../utils/invoice';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

type SummaryRowProps = {
  label: string;
  value: string;
  emphasized?: boolean;
};

function SummaryRow({ label, value, emphasized = false }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={[
          styles.summaryLabel,
          emphasized && styles.summaryLabelEmphasized,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          emphasized && styles.summaryValueEmphasized,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function PaymentScreen({ navigation, route }: Props) {
  const { invoiceId } = route.params;
  const { dishes, invoices, payInvoice } = useRestaurant();
  const invoice = invoices.find(item => item.id === invoiceId);

  const [receivedDigits, setReceivedDigits] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const moneyInputFocused = useRef(false);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (!moneyInputFocused.current) {
        return;
      }
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 120);
    });

    return () => subscription.remove();
  }, []);

  const lines = getInvoiceLines(invoice, dishes);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const vat = getVatAmount(subtotal);
  const total = getInvoiceTotal(subtotal);
  const received = Number(receivedDigits || '0');
  const isShort = received > 0 && received < total;
  const change = Math.max(received - total, 0);
  const canPay =
    Boolean(invoice) &&
    invoice?.status === INVOICE_SERVING &&
    lines.length > 0 &&
    total > 0 &&
    received >= total;

  if (!invoice || invoice.status !== INVOICE_SERVING) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <View style={styles.header}>
          <ScreenHeader
            title="Thanh toán"
            subtitle="Hoá đơn không khả dụng"
            onBack={() => navigation.goBack()}
          />
        </View>
        <View style={styles.missingContainer}>
          <EmptyState
            title="Hoá đơn không khả dụng"
            description={
              invoice
                ? 'Hoá đơn này đã được thanh toán.'
                : 'Không tìm thấy hoá đơn cần thanh toán.'
            }
            action={
              <PrimaryButton
                label="Về sơ đồ bàn"
                onPress={() => navigation.popToTop()}
              />
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    if (!canPay) {
      return;
    }

    Alert.alert(
      'Xác nhận thanh toán',
      `Bàn ${formatTableNumber(invoice.tableNumber)} · Tổng cộng ${formatCurrency(
        total,
      )}\nKhách đưa ${formatCurrency(
        received,
      )} · Tiền thừa ${formatCurrency(change)}`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            payInvoice(invoice.id);
            navigation.popToTop();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ScreenHeader
            title="Thanh toán"
            subtitle={`Bàn ${formatTableNumber(
              invoice.tableNumber,
            )} · ${invoice.createdAt}`}
            onBack={() => navigation.goBack()}
          />
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.metaCard}>
            <View style={styles.metaTop}>
              <View>
                <Text style={styles.metaLabel}>HOÁ ĐƠN</Text>
                <Text style={styles.metaTitle}>
                  Bàn {formatTableNumber(invoice.tableNumber)}
                </Text>
              </View>
              <View style={styles.metaStatusPill}>
                <View style={styles.metaStatusDot} />
                <Text style={styles.metaStatusText}>Đang phục vụ</Text>
              </View>
            </View>
            <Text style={styles.metaTime}>Tạo lúc {invoice.createdAt}</Text>
          </View>

          <Text style={styles.sectionLabel}>CHI TIẾT MÓN</Text>
          <View style={styles.card}>
            {lines.map((line, index) => (
              <View
                key={line.dish.id}
                style={[
                  styles.itemRow,
                  index > 0 && styles.itemRowDivider,
                ]}
              >
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{line.quantity}×</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {line.dish.name}
                  </Text>
                  <Text style={styles.itemUnit}>
                    {formatCurrency(line.dish.price)} / phần
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatCurrency(line.lineTotal)}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>TỔNG KẾT</Text>
          <View style={styles.card}>
            <SummaryRow
              label="Tạm tính"
              value={formatCurrency(subtotal)}
            />
            <SummaryRow label="VAT (8%)" value={formatCurrency(vat)} />
            <View style={styles.summaryDivider} />
            <SummaryRow
              label="Tổng cộng"
              value={formatCurrency(total)}
              emphasized
            />
          </View>

          <Text style={styles.sectionLabel}>THANH TOÁN</Text>
          <View style={styles.card}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Tiền khách đưa</Text>
              <Pressable
                onPress={() => setReceivedDigits(String(total))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Điền đúng số tiền"
                style={({ pressed }) => [
                  styles.exactButton,
                  pressed && styles.exactButtonPressed,
                ]}
              >
                <Text style={styles.exactButtonText}>Đủ tiền</Text>
              </Pressable>
            </View>

            <View
              style={[
                styles.moneyWrapper,
                inputFocused && styles.moneyWrapperFocused,
                isShort && styles.moneyWrapperInvalid,
              ]}
            >
              <TextInput
                value={formatThousands(receivedDigits)}
                onChangeText={text =>
                  setReceivedDigits(normalizeDigits(text, 9))
                }
                onFocus={() => {
                  setInputFocused(true);
                  moneyInputFocused.current = true;
                }}
                onBlur={() => {
                  setInputFocused(false);
                  moneyInputFocused.current = false;
                }}
                inputMode="numeric"
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                maxLength={11}
                style={styles.moneyInput}
                accessibilityLabel="Tiền khách đưa"
              />
              <Text style={styles.moneySuffix}>đ</Text>
            </View>

            {isShort ? (
              <Text style={styles.fieldError}>
                Khách đưa thiếu {formatCurrency(total - received)}.
              </Text>
            ) : (
              <Text style={styles.fieldHint}>
                Nhập số tiền khách đưa để tính tiền thừa.
              </Text>
            )}

            <View style={styles.changeRow}>
              <Text style={styles.changeLabel}>
                {isShort ? 'Còn thiếu' : 'Tiền thừa'}
              </Text>
              <Text
                style={[
                  styles.changeValue,
                  isShort
                    ? styles.changeShort
                    : change > 0
                    ? styles.changePositive
                    : styles.changeNeutral,
                ]}
              >
                {formatCurrency(isShort ? total - received : change)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>TỔNG CỘNG</Text>
            <Text style={styles.footerAmount}>{formatCurrency(total)}</Text>
          </View>
          <PrimaryButton
            label="Thanh toán"
            onPress={handleConfirm}
            disabled={!canPay}
            style={styles.payButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 4,
  },
  missingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 20,
    paddingBottom: 28,
  },
  metaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 18,
    ...shadows.card,
  },
  metaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaLabel: {
    ...typography.overline,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metaTitle: {
    ...typography.title,
    color: colors.white,
    marginTop: 3,
  },
  metaStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.17)',
  },
  metaStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  metaStatusText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
    color: colors.white,
  },
  metaTime: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 10,
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadows.card,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  quantityBadge: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemName: {
    ...typography.bodyStrong,
    fontSize: 14.5,
    lineHeight: 20,
    color: colors.text,
  },
  itemUnit: {
    ...typography.caption,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemTotal: {
    ...typography.bodyStrong,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 12,
  },
  summaryLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  summaryLabelEmphasized: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  summaryValueEmphasized: {
    ...typography.amount,
    color: colors.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  exactButton: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  exactButtonPressed: {
    opacity: 0.7,
  },
  exactButtonText: {
    ...typography.caption,
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  moneyWrapper: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  moneyWrapperFocused: {
    borderColor: colors.primary,
  },
  moneyWrapperInvalid: {
    borderColor: colors.danger,
  },
  moneyInput: {
    flex: 1,
    height: 54,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  moneySuffix: {
    ...typography.bodyStrong,
    color: colors.textMuted,
    paddingRight: 16,
  },
  fieldHint: {
    ...typography.caption,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 6,
  },
  fieldError: {
    ...typography.caption,
    fontSize: 12.5,
    color: colors.danger,
    marginTop: 6,
  },
  changeRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  changeLabel: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  changeValue: {
    ...typography.amount,
    fontSize: 18,
  },
  changeShort: {
    color: colors.danger,
  },
  changePositive: {
    color: colors.success,
  },
  changeNeutral: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerInfo: {
    flexShrink: 1,
  },
  footerLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textMuted,
  },
  footerAmount: {
    ...typography.amount,
    color: colors.text,
    marginTop: 3,
  },
  payButton: {
    height: 50,
    minWidth: 148,
    paddingHorizontal: 18,
  },
});
