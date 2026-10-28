import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';
import { Icon } from './Icon';

type ControlProps = {
  icon: 'plus' | 'minus';
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

function Control({ icon, label, onPress, disabled }: ControlProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.stepButton,
        pressed && !disabled && styles.stepButtonPressed,
        disabled && styles.stepButtonDisabled,
      ]}
    >
      <Icon
        name={icon}
        size={17}
        color={disabled ? colors.textMuted : colors.primary}
        strokeWidth={2.2}
      />
    </Pressable>
  );
}

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  increaseDisabled?: boolean;
};

export function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  increaseDisabled = false,
}: Props) {
  if (quantity === 0) {
    return (
      <Pressable
        onPress={onIncrease}
        disabled={increaseDisabled}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Thêm một phần"
        style={({ pressed }) => [
          styles.addButton,
          increaseDisabled && styles.addButtonDisabled,
          pressed && !increaseDisabled && styles.addButtonPressed,
        ]}
      >
        <Icon
          name="plus"
          size={18}
          color={increaseDisabled ? colors.textMuted : colors.primary}
          strokeWidth={2.2}
        />
      </Pressable>
    );
  }

  return (
    <View style={styles.stepper}>
      <Control icon="minus" label="Bớt một phần" onPress={onDecrease} />
      <Text style={styles.quantity}>{quantity}</Text>
      <Control
        icon="plus"
        label="Thêm một phần"
        onPress={onIncrease}
        disabled={increaseDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  addButtonPressed: {
    backgroundColor: colors.primarySoftPressed,
  },
  stepper: {
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stepButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonPressed: {
    backgroundColor: colors.primarySoftPressed,
  },
  stepButtonDisabled: {
    opacity: 0.45,
  },
  quantity: {
    ...typography.bodyStrong,
    fontWeight: '800',
    color: colors.primaryDark,
    minWidth: 24,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
