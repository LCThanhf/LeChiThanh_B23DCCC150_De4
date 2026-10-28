import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export type IconName = 'back' | 'plus' | 'minus' | 'menu';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * A small set of flat, geometric icons drawn with Views.
 * This keeps the app dependency-free and visually consistent.
 */
export function Icon({
  name,
  size = 20,
  color = colors.text,
  strokeWidth = 2,
}: Props) {
  if (name === 'plus' || name === 'minus') {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        <View
          style={[
            styles.absolute,
            {
              width: size * 0.6,
              height: strokeWidth,
              borderRadius: strokeWidth,
              backgroundColor: color,
              top: (size - strokeWidth) / 2,
              left: size * 0.2,
            },
          ]}
        />
        {name === 'plus' ? (
          <View
            style={[
              styles.absolute,
              {
                width: strokeWidth,
                height: size * 0.6,
                borderRadius: strokeWidth,
                backgroundColor: color,
                top: size * 0.2,
                left: (size - strokeWidth) / 2,
              },
            ]}
          />
        ) : null}
      </View>
    );
  }

  if (name === 'back') {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        <View
          style={{
            width: size * 0.44,
            height: size * 0.44,
            borderLeftWidth: strokeWidth,
            borderBottomWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
            marginLeft: size * 0.14,
            marginTop: -size * 0.04,
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.6,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          marginVertical: size * 0.075,
        }}
      />
      <View
        style={{
          width: size * 0.42,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          marginVertical: size * 0.075,
        }}
      />
      <View
        style={{
          width: size * 0.6,
          height: strokeWidth,
          borderRadius: strokeWidth,
          backgroundColor: color,
          marginVertical: size * 0.075,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
  },
});
