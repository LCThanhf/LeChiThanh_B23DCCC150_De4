import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, typography } from '../theme';
import { Icon } from './Icon';
import type { IconName } from './Icon';

type Props = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: 'solid' | 'outline';
  accessibilityLabel?: string;
};

export function PillButton({
  label,
  onPress,
  icon,
  tone = 'outline',
  accessibilityLabel,
}: Props) {
  const solid = tone === 'solid';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        solid ? styles.solid : styles.outline,
        pressed && styles.pressed,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          size={16}
          color={solid ? colors.white : colors.primary}
          strokeWidth={2.2}
        />
      ) : null}
      <Text style={[styles.label, solid ? styles.labelSolid : styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.small,
    fontWeight: '700',
  },
  labelSolid: {
    color: colors.white,
  },
  labelOutline: {
    color: colors.text,
  },
});
