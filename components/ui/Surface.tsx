/**
 * Surface - Modern Container Component
 * Handles elevation, glass effects, and surfaces
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface SurfaceProps {
  children: ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4;
  glass?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

function Surface({
  children,
  elevation = 1,
  glass = false,
  variant = 'default',
  padding = 16,
  style,
  onPress,
}: SurfaceProps) {
  const { theme } = useModernTheme();

  const shadowMap = {
    0: theme.shadows.none,
    1: theme.shadows.xs,
    2: theme.shadows.sm,
    3: theme.shadows.md,
    4: theme.shadows.lg,
  };

  const getBackgroundColor = () => {
    if (glass) return theme.colors.glassLight;
    if (variant === 'elevated') return theme.colors.surfaceElevated;
    return theme.colors.surface;
  };

  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    }
    if (glass) {
      return {
        borderWidth: 1,
        borderColor: theme.colors.glassLight,
      };
    }
    return {};
  };

  const containerStyle = [
    styles.surface,
    {
      backgroundColor: getBackgroundColor(),
      padding,
      borderRadius: theme.radius.xl,
      ...shadowMap[elevation],
      ...getBorderStyle(),
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...containerStyle,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    overflow: 'hidden',
  },
});

export default memo(Surface);
