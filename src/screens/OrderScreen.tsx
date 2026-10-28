import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuantityStepper } from '../components/QuantityStepper';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeader } from '../components/SectionHeader';
import type { RootStackParamList } from '../navigation/types';
import { useRestaurant } from '../store/RestaurantContext';
import {
  categoryAccents,
  colors,
  layout,
  radius,
  shadows,
  typography,
} from '../theme';
import type { Dish } from '../types';
import { groupDishesByCategory } from '../utils/dishes';
import { formatCurrency, formatTableNumber } from '../utils/format';
import {
  getInvoiceItemCount,
  getInvoiceSubtotal,
} from '../utils/invoice';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

export default function OrderScreen({ navigation, route }: Props) {
  const { tableNumber } = route.params;
  const { changeDishQuantity, dishes, getActiveInvoiceForTable } =
    useRestaurant();

  const invoice = getActiveInvoiceForTable(tableNumber);
  const itemCount = getInvoiceItemCount(invoice);
  const subtotal = getInvoiceSubtotal(invoice, dishes);
  const sections = groupDishesByCategory(dishes);

  const getQuantity = (dishId: string) =>
    invoice?.items.find(item => item.dishId === dishId)?.quantity ?? 0;

  const renderDish = ({ item }: { item: Dish }) => {
    const quantity = getQuantity(item.id);

    return (
      <View
        style={[
          styles.orderCard,
          !item.available && styles.orderCardUnavailable,
        ]}
      >
        <View style={styles.dishInfo}>
          <View style={styles.dishNameRow}>
            <Text
              style={[
                styles.dishName,
                !item.available && styles.dishNameUnavailable,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {!item.available ? (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>Hết món</Text>
              </View>
            ) : null}
          </View>
          <Text
            style={[
              styles.dishPrice,
              !item.available && styles.dishPriceUnavailable,
            ]}
          >
            {formatCurrency(item.price)}
          </Text>
        </View>

        <QuantityStepper
          quantity={quantity}
          increaseDisabled={!item.available}
          onIncrease={() =>
            changeDishQuantity(tableNumber, item.id, 1)
          }
          onDecrease={() =>
            changeDishQuantity(tableNumber, item.id, -1)
          }
        />
      </View>
    );
  };

  const goToPayment = () => {
    if (!invoice || itemCount === 0) {
      return;
    }
    navigation.navigate('Payment', { invoiceId: invoice.id });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={styles.header}>
        <ScreenHeader
          title={`Bàn ${formatTableNumber(tableNumber)}`}
          subtitle={
            itemCount > 0
              ? `${itemCount} món · Tạm tính ${formatCurrency(subtotal)}`
              : 'Chưa gọi món nào'
          }
          onBack={() => navigation.goBack()}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderDish}
        renderSectionHeader={({ section }) => (
          <SectionHeader
            title={section.title}
            count={section.data.length}
            accentColor={categoryAccents[section.title]}
          />
        )}
        ListHeaderComponent={
          <View style={styles.noteRow}>
            <View
              style={[
                styles.noteDot,
                invoice ? styles.noteDotActive : styles.noteDotIdle,
              ]}
            />
            <Text style={styles.noteText}>
              {invoice
                ? `Hoá đơn đang phục vụ · tạo lúc ${invoice.createdAt}`
                : 'Chọn món để bắt đầu gọi cho bàn này'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Thực đơn đang trống"
            description="Thêm món vào thực đơn để có thể gọi cho bàn này."
            action={
              <PrimaryButton
                label="Thêm món"
                onPress={() => navigation.navigate('DishForm')}
              />
            }
          />
        }
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>TẠM TÍNH</Text>
          <Text style={styles.footerAmount}>{formatCurrency(subtotal)}</Text>
        </View>
        <PrimaryButton
          label="Thanh toán"
          onPress={goToPayment}
          disabled={!invoice || itemCount === 0}
          style={styles.payButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 4,
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 24,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 16,
    paddingBottom: 2,
    paddingHorizontal: 2,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  noteDotActive: {
    backgroundColor: colors.success,
  },
  noteDotIdle: {
    backgroundColor: colors.borderStrong,
  },
  noteText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 14,
    marginBottom: 10,
    ...shadows.card,
  },
  orderCardUnavailable: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  dishInfo: {
    flex: 1,
    paddingRight: 12,
  },
  dishNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishName: {
    ...typography.heading,
    fontSize: 15.5,
    color: colors.text,
    flexShrink: 1,
  },
  dishNameUnavailable: {
    color: colors.textMuted,
  },
  dishPrice: {
    ...typography.small,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  dishPriceUnavailable: {
    color: colors.textMuted,
  },
  soldOutBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.soldOutSoft,
  },
  soldOutText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: colors.soldOut,
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
