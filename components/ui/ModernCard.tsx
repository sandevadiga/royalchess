/**
 * ModernCard - Enhanced Card Component
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface ModernCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: number | 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

function ModernCard({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  style,
}: ModernCardProps) {
  const { theme } = useModernTheme();

  const paddingMap = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.lg,
    lg: theme.spacing.xl,
  };

  const paddingValue = typeof padding === 'number' ? padding : paddingMap[padding];

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surfaceElevated,
          borderWidth: 0,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.none,
        };
      case 'glass':
        return {
          backgroundColor: theme.colors.glassLight,
          borderWidth: 1,
          borderColor: theme.colors.glassLight,
          ...theme.shadows.sm,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
          ...theme.shadows.sm,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle = [
    styles.card,
    {
      padding: paddingValue,
      borderRadius: theme.radius.xl,
      ...variantStyles,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...containerStyle,
          pressed && {
            opacity: 0.9,
            transform: [{ scale: 0.98 }],
          },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default memo(ModernCard);
