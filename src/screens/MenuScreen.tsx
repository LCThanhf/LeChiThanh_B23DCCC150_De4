import React from 'react';
import {
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { PillButton } from '../components/PillButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeader } from '../components/SectionHeader';
import { TABLE_COUNT } from '../constants';
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
import { formatCurrency } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({ navigation }: Props) {
  const {
    deleteDish,
    dishes,
    isDishInActiveInvoice,
    occupiedTables,
    toggleDishAvailability,
  } = useRestaurant();

  const sections = groupDishesByCategory(dishes);

  const handleLongPress = (dish: Dish) => {
    if (isDishInActiveInvoice(dish.id)) {
      Alert.alert(
        'Không thể xoá món',
        `"${dish.name}" đang có trong một hoá đơn "Đang phục vụ". Hãy thanh toán hoặc bỏ món khỏi hoá đơn trước khi xoá.`,
        [{ text: 'Đã hiểu' }],
      );
      return;
    }

    Alert.alert(
      'Xoá món ăn?',
      `Bạn có chắc muốn xoá "${dish.name}" khỏi thực đơn? Thao tác này không thể hoàn tác.`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => deleteDish(dish.id),
        },
      ],
    );
  };

  const renderDish = ({ item }: { item: Dish }) => (
    <View
      style={[
        styles.dishCard,
        !item.available && styles.dishCardUnavailable,
      ]}
    >
      <Pressable
        onPress={() =>
          navigation.navigate('DishForm', { dishId: item.id })
        }
        onLongPress={() => handleLongPress(item)}
        delayLongPress={400}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${formatCurrency(item.price)}${
          item.available ? '' : ', hết món'
        }`}
        accessibilityHint="Chạm để sửa, nhấn giữ để xoá"
        style={({ pressed }) => [
          styles.dishMain,
          pressed && styles.dishMainPressed,
        ]}
      >
        <View style={styles.dishNameRow}>
          <Text
            style={[
              styles.dishName,
              !item.available && styles.dishTextUnavailable,
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
            !item.available && styles.dishTextUnavailable,
          ]}
        >
          {formatCurrency(item.price)}
        </Text>
      </Pressable>

      <Switch
        value={item.available}
        onValueChange={() => toggleDishAvailability(item.id)}
        trackColor={{ false: colors.borderStrong, true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.borderStrong}
        accessibilityLabel={`${item.name} còn phục vụ`}
        style={styles.switch}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={styles.header}>
        <ScreenHeader
          title="Thực đơn"
          subtitle={`${dishes.length} món · ${occupiedTables.length}/${TABLE_COUNT} bàn có khách`}
          onBack={() => navigation.goBack()}
          right={
            <PillButton
              label="Thêm món"
              icon="plus"
              tone="solid"
              onPress={() => navigation.navigate('DishForm')}
            />
          }
        />
      </View>

      {dishes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Thực đơn đang trống"
            description="Thêm món đầu tiên để bắt đầu phục vụ khách."
            action={
              <PrimaryButton
                label="Thêm món đầu tiên"
                onPress={() => navigation.navigate('DishForm')}
              />
            }
          />
        </View>
      ) : (
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
            <View style={styles.hintRow}>
              <View style={styles.hintDot} />
              <Text style={styles.hintText}>
                Chạm để sửa · Nhấn giữ để xoá
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingBottom: 28,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 16,
    paddingBottom: 2,
    paddingHorizontal: 2,
  },
  hintDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  hintText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    paddingRight: 14,
    ...shadows.card,
  },
  dishCardUnavailable: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  dishMain: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 16,
    paddingRight: 10,
  },
  dishMainPressed: {
    opacity: 0.6,
  },
  dishNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishName: {
    ...typography.heading,
    color: colors.text,
    flexShrink: 1,
  },
  dishTextUnavailable: {
    color: colors.textMuted,
  },
  dishPrice: {
    ...typography.small,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
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
  switch: {
    marginLeft: 2,
    transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },
});
