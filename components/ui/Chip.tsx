/**
 * Chip - Interactive Tag Component
 */

import { memo, ReactNode } from 'react';
import { StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filled' | 'outlined';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
}

function Chip({
  children,
  selected = false,
  onPress,
  variant = 'filled',
  leftIcon,
  rightIcon,
  style,
}: ChipProps) {
  const { theme } = useModernTheme();

  const getStyles = () => {
    if (selected) {
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        textColor: theme.colors.textInverse,
      };
    }

    if (variant === 'outlined') {
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
        textColor: theme.colors.textPrimary,
      };
    }

    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      textColor: theme.colors.textPrimary,
    };
  };

  const chipStyles = getStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: chipStyles.backgroundColor,
          borderWidth: 1,
          borderColor: chipStyles.borderColor,
          borderRadius: theme.radius.full,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          opacity: pressed ? 0.8 : 1,
          transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
          ...theme.shadows.xs,
        },
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          styles.text,
          {
            color: chipStyles.textColor,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
          },
          leftIcon && { marginLeft: theme.spacing.xs },
          rightIcon && { marginRight: theme.spacing.xs },
        ]}
      >
        {children}
      </Text>
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default memo(Chip);
