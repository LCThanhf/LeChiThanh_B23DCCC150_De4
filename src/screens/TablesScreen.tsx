import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TABLE_COUNT } from '../constants';
import { ScreenHeader } from '../components/ScreenHeader';
import { PillButton } from '../components/PillButton';
import { useRestaurant } from '../store/RestaurantContext';
import type { Invoice } from '../types';
import type { RootStackParamList } from '../navigation/types';
import {
  colors,
  layout,
  radius,
  shadows,
  typography,
} from '../theme';
import { formatCurrency, formatTableNumber } from '../utils/format';
import {
  getInvoiceItemCount,
  getInvoiceSubtotal,
} from '../utils/invoice';

type Props = NativeStackScreenProps<RootStackParamList, 'Tables'>;

const TABLE_NUMBERS = Array.from(
  { length: TABLE_COUNT },
  (_, index) => index + 1,
);

type TableCardProps = {
  tableNumber: number;
  invoice?: Invoice;
  itemCount: number;
  subtotal: number;
  onPress: () => void;
};

function TableCard({
  tableNumber,
  invoice,
  itemCount,
  subtotal,
  onPress,
}: TableCardProps) {
  const occupied = Boolean(invoice);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Bàn ${formatTableNumber(tableNumber)}, ${
        occupied ? 'có khách' : 'trống'
      }`}
      style={({ pressed }) => [
        styles.tableCard,
        occupied ? styles.tableCardOccupied : styles.tableCardEmpty,
        pressed && styles.tableCardPressed,
      ]}
    >
      <View style={styles.tableTopRow}>
        <Text
          style={[
            styles.tableEyebrow,
            occupied && styles.textOnPrimaryMuted,
          ]}
        >
          BÀN
        </Text>
        <View
          style={[
            styles.statusPill,
            occupied ? styles.statusPillOccupied : styles.statusPillEmpty,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              occupied ? styles.statusDotOccupied : styles.statusDotEmpty,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              occupied ? styles.statusTextOccupied : styles.statusTextEmpty,
            ]}
          >
            {occupied ? 'Có khách' : 'Trống'}
          </Text>
        </View>
      </View>

      <Text style={[styles.tableNumber, occupied && styles.textOnPrimary]}>
        {formatTableNumber(tableNumber)}
      </Text>

      <View style={styles.tableFooter}>
        {occupied ? (
          <>
            <Text style={styles.tableMeta}>{itemCount} món</Text>
            <Text style={styles.tableTotal}>{formatCurrency(subtotal)}</Text>
          </>
        ) : (
          <Text style={styles.tableEmptyHint}>Chạm để gọi món</Text>
        )}
      </View>
    </Pressable>
  );
}

export default function TablesScreen({ navigation }: Props) {
  const {
    dishes,
    getActiveInvoiceForTable,
    invoices,
    occupiedTables,
  } = useRestaurant();

  const renderTable = ({ item: tableNumber }: { item: number }) => {
    const invoice = getActiveInvoiceForTable(tableNumber);

    return (
      <TableCard
        tableNumber={tableNumber}
        invoice={invoice}
        itemCount={getInvoiceItemCount(invoice)}
        subtotal={getInvoiceSubtotal(invoice, dishes)}
        onPress={() => navigation.navigate('Order', { tableNumber })}
      />
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={styles.header}>
        <ScreenHeader
          title="Sơ đồ bàn"
          subtitle="Chạm vào bàn để gọi món"
          right={
            <PillButton
              label="Thực đơn"
              icon="menu"
              onPress={() => navigation.navigate('Menu')}
            />
          }
        />

        <View style={styles.legendRow}>
          <View style={styles.legendGroup}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotOccupied]} />
              <Text style={styles.legendLabel}>Có khách</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotEmpty]} />
              <Text style={styles.legendLabel}>Trống</Text>
            </View>
          </View>
          <Text style={styles.legendSummary}>
            {occupiedTables.length}/{TABLE_COUNT} bàn có khách
          </Text>
        </View>
      </View>

      <FlatList
        data={TABLE_NUMBERS}
        keyExtractor={item => String(item)}
        renderItem={renderTable}
        extraData={invoices}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
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
  legendRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendDotOccupied: {
    backgroundColor: colors.primary,
  },
  legendDotEmpty: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  legendSummary: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gridContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 12,
  },
  gridRow: {
    gap: 12,
  },
  tableCard: {
    flex: 1,
    minHeight: 158,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'space-between',
    ...shadows.card,
  },
  tableCardEmpty: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tableCardOccupied: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tableCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  tableTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableEyebrow: {
    ...typography.overline,
    color: colors.textMuted,
  },
  textOnPrimary: {
    color: colors.white,
  },
  textOnPrimaryMuted: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusPillOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.17)',
  },
  statusPillEmpty: {
    backgroundColor: colors.successSoft,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOccupied: {
    backgroundColor: colors.white,
  },
  statusDotEmpty: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
  },
  statusTextOccupied: {
    color: colors.white,
  },
  statusTextEmpty: {
    color: colors.success,
  },
  tableNumber: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1.2,
    color: colors.text,
    marginTop: 2,
  },
  tableFooter: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  tableMeta: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  tableTotal: {
    ...typography.bodyStrong,
    fontWeight: '800',
    color: colors.white,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  tableEmptyHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
