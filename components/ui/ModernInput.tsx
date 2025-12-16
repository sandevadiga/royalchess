/**
 * ModernInput - Enhanced Input Component
 */

import { memo, ReactNode, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface ModernInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  containerStyle?: ViewStyle;
}

function ModernInput({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  containerStyle,
  style,
  ...props
}: ModernInputProps) {
  const { theme } = useModernTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderRadius: theme.radius.md,
          borderColor: isFocused ? theme.colors.primary : 'transparent',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderRadius: theme.radius.lg,
          borderColor: isFocused
            ? theme.colors.primary
            : error
            ? theme.colors.error
            : theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderRadius: theme.radius.lg,
          borderColor: isFocused ? theme.colors.primary : theme.colors.border,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? theme.colors.error : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              marginBottom: theme.spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            ...variantStyles,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
          },
        ]}
      >
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>
        )}

        <TextInput
          {...props}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.base,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {rightIcon && (
          <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.xs,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },
  error: {},
});

export default memo(ModernInput);
