import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  title: string;
  count: number;
  accentColor: string;
};

export function SectionHeader({ title, count, accentColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: accentColor }]} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    ...typography.bodyStrong,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  countBadge: {
    minWidth: 24,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
