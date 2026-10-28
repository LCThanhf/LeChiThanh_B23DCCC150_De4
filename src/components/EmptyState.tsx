import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type Props = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.art}>
        <View style={styles.plateOuter}>
          <View style={styles.plateInner} />
        </View>
        <View style={styles.dotLarge} />
        <View style={styles.dotSmall} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  art: {
    width: 96,
    height: 96,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotLarge: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primarySoft,
    top: 4,
    right: 4,
  },
  dotSmall: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    bottom: 9,
    left: 6,
  },
  title: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 280,
  },
  action: {
    marginTop: 22,
    width: '100%',
    maxWidth: 250,
  },
});
