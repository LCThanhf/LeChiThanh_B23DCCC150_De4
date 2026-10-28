import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Icon name="back" size={20} color={colors.text} strokeWidth={2.2} />
          </Pressable>
        ) : (
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandLetter}>B</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Bàn Ăn</Text>
              <Text style={styles.brandTag}>QUẢN LÝ NHÀ HÀNG</Text>
            </View>
          </View>
        )}

        {right ? <View style={styles.right}>{right}</View> : null}
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800',
    color: colors.white,
  },
  brandName: {
    ...typography.bodyStrong,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  brandTag: {
    fontSize: 8.5,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.textMuted,
  },
  right: {
    marginLeft: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  title: {
    ...typography.display,
    color: colors.text,
    marginTop: 18,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 3,
  },
});
