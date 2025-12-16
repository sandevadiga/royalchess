/**
 * GlassView - Glassmorphism Component
 * Creates a frosted glass effect with blur
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface GlassViewProps {
  children: ReactNode;
  intensity?: number;
  variant?: 'light' | 'medium' | 'dark' | 'primary';
  style?: ViewStyle;
  borderRadius?: number;
  withBorder?: boolean;
}

function GlassView({
  children,
  intensity = 20,
  variant = 'medium',
  style,
  borderRadius = 16,
  withBorder = true,
}: GlassViewProps) {
  const { theme, isDark } = useModernTheme();

  const getGlassStyle = () => {
    switch (variant) {
      case 'light':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
        };
      case 'medium':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)',
        };
      case 'dark':
        return {
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
        };
      case 'primary':
        return {
          backgroundColor: `${theme.colors.primary}20`,
          borderColor: `${theme.colors.primary}40`,
        };
    }
  };

  const glassStyle = getGlassStyle();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: glassStyle.backgroundColor,
          borderWidth: withBorder ? 1 : 0,
          borderColor: glassStyle.borderColor,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default memo(GlassView);
