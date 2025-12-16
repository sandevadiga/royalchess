/**
 * ModernButton - Refactored Button with Modern Standards
 * Supports multiple variants, sizes, and glass effects
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface ModernButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function ModernButton({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ModernButtonProps) {
  const { theme } = useModernTheme();

  const sizeStyles = {
    sm: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.fontSize.sm,
      borderRadius: theme.radius.md,
    },
    md: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      fontSize: theme.typography.fontSize.base,
      borderRadius: theme.radius.lg,
    },
    lg: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xxl,
      fontSize: theme.typography.fontSize.md,
      borderRadius: theme.radius.xl,
    },
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.textInverse,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.textInverse,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.textPrimary,
          borderWidth: 0,
        };
      case 'glass':
        return {
          backgroundColor: theme.colors.glassLight,
          color: theme.colors.textPrimary,
          borderWidth: 1,
          borderColor: theme.colors.glassLight,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.textInverse,
          borderWidth: 0,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const currentSize = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: currentSize.borderRadius,
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
          transform: pressed && !isDisabled ? [{ scale: 0.98 }] : [{ scale: 1 }],
          ...theme.shadows.sm,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.color,
                fontSize: currentSize.fontSize,
                fontWeight: theme.typography.fontWeight.semibold,
              },
              leftIcon && { marginLeft: theme.spacing.sm },
              rightIcon && { marginRight: theme.spacing.sm },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});

export default memo(ModernButton);
