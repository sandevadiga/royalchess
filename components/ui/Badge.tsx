/**
 * Badge - Modern Badge Component
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

function Badge({ children, variant = 'primary', size = 'md', style }: BadgeProps) {
  const { theme } = useModernTheme();

  const sizeStyles = {
    sm: {
      paddingVertical: theme.spacing.xxs,
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.typography.fontSize.xs,
      borderRadius: theme.radius.sm,
    },
    md: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.sm,
      borderRadius: theme.radius.md,
    },
    lg: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.fontSize.base,
      borderRadius: theme.radius.lg,
    },
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${theme.colors.primary}20`,
          color: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: `${theme.colors.secondary}20`,
          color: theme.colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: `${theme.colors.success}20`,
          color: theme.colors.success,
        };
      case 'error':
        return {
          backgroundColor: `${theme.colors.error}20`,
          color: theme.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: `${theme.colors.warning}20`,
          color: theme.colors.warning,
        };
      case 'info':
        return {
          backgroundColor: `${theme.colors.info}20`,
          color: theme.colors.info,
        };
      case 'neutral':
        return {
          backgroundColor: theme.colors.border,
          color: theme.colors.textSecondary,
        };
    }
  };

  const variantColors = getVariantColors();
  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantColors.backgroundColor,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: currentSize.borderRadius,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantColors.color,
            fontSize: currentSize.fontSize,
            fontWeight: theme.typography.fontWeight.semibold,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});

export default memo(Badge);
