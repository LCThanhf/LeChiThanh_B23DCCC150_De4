import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import type { RootStackParamList } from '../navigation/types';
import { useRestaurant } from '../store/RestaurantContext';
import {
  categoryAccents,
  colors,
  layout,
  radius,
  typography,
} from '../theme';
import { CATEGORIES } from '../types';
import type { Category, DishInput } from '../types';
import { formatThousands, normalizeDigits } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'DishForm'>;

type FormErrors = {
  name?: string;
  price?: string;
};

export default function DishFormScreen({ navigation, route }: Props) {
  const { dishId } = route.params ?? {};
  const { addDish, dishes, updateDish } = useRestaurant();
  const dish = dishId ? dishes.find(item => item.id === dishId) : undefined;

  const [name, setName] = useState(dish?.name ?? '');
  const [priceDigits, setPriceDigits] = useState(
    dish ? String(dish.price) : '',
  );
  const [category, setCategory] = useState<Category>(
    dish?.category ?? 'Món chính',
  );
  const [available, setAvailable] = useState(dish?.available ?? true);
  const [showErrors, setShowErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'price' | null>(
    null,
  );

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      nextErrors.name = 'Vui lòng nhập tên món.';
    } else {
      const duplicated = dishes.some(
        item =>
          item.id !== dish?.id &&
          item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      );
      if (duplicated) {
        nextErrors.name = 'Tên món này đã tồn tại.';
      }
    }

    const price = Number(priceDigits);
    if (!priceDigits) {
      nextErrors.price = 'Vui lòng nhập giá bán.';
    } else if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = 'Giá bán phải lớn hơn 0.';
    } else if (price % 1000 !== 0) {
      nextErrors.price = 'Giá bán phải là bội số của 1.000 đ.';
    }

    return nextErrors;
  };

  const errors: FormErrors = showErrors ? validateForm() : {};

  const handleSave = () => {
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setShowErrors(true);
      return;
    }

    const input: DishInput = {
      name: name.trim(),
      category,
      price: Number(priceDigits),
      available,
    };

    if (dish) {
      updateDish(dish.id, input);
    } else {
      addDish(input);
    }

    navigation.goBack();
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
            title={dish ? 'Sửa món' : 'Thêm món'}
            subtitle={
              dish
                ? 'Cập nhật thông tin món ăn'
                : 'Thêm món mới vào thực đơn'
            }
            onBack={() => navigation.goBack()}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.field}>
            <Text style={styles.label}>TÊN MÓN</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ví dụ: Phở bò đặc biệt"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              maxLength={60}
              style={[
                styles.input,
                focusedField === 'name' && styles.inputFocused,
                errors.name ? styles.inputInvalid : null,
              ]}
              accessibilityLabel="Tên món"
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>GIÁ BÁN</Text>
            <View
              style={[
                styles.priceWrapper,
                focusedField === 'price' && styles.inputFocused,
                errors.price ? styles.inputInvalid : null,
              ]}
            >
              <TextInput
                value={formatThousands(priceDigits)}
                onChangeText={text =>
                  setPriceDigits(normalizeDigits(text, 9))
                }
                onFocus={() => setFocusedField('price')}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                maxLength={11}
                style={styles.priceInput}
                accessibilityLabel="Giá bán"
              />
              <Text style={styles.priceSuffix}>đ</Text>
            </View>
            {errors.price ? (
              <Text style={styles.errorText}>{errors.price}</Text>
            ) : (
              <Text style={styles.helperText}>
                Giá bán phải là bội số của 1.000 đ.
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>LOẠI MÓN</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(item => {
                const selected = category === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Loại món ${item}`}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      selected && styles.categoryChipSelected,
                      pressed && styles.categoryChipPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryDot,
                        {
                          backgroundColor: selected
                            ? colors.white
                            : categoryAccents[item],
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>TRẠNG THÁI</Text>
            <View style={styles.availableCard}>
              <View style={styles.availableText}>
                <Text style={styles.availableTitle}>Còn phục vụ</Text>
                <Text style={styles.availableDescription}>
                  Khách có thể gọi món này
                </Text>
              </View>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{
                  false: colors.borderStrong,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.borderStrong}
                accessibilityLabel="Món còn phục vụ"
              />
            </View>
          </View>

          <PrimaryButton
            label={dish ? 'Lưu thay đổi' : 'Thêm món'}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </ScrollView>
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
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 40,
  },
  field: {
    marginBottom: 22,
  },
  label: {
    ...typography.overline,
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputInvalid: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.caption,
    fontSize: 12.5,
    color: colors.danger,
    marginTop: 6,
  },
  helperText: {
    ...typography.caption,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 6,
  },
  priceWrapper: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priceInput: {
    flex: 1,
    height: 54,
    paddingLeft: 16,
    paddingRight: 8,
    ...typography.body,
    color: colors.text,
  },
  priceSuffix: {
    ...typography.bodyStrong,
    color: colors.textMuted,
    paddingRight: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 47,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipPressed: {
    opacity: 0.8,
  },
  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  categoryText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  availableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  availableText: {
    flex: 1,
    paddingRight: 12,
  },
  availableTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  availableDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  saveButton: {
    marginTop: 6,
  },
});
