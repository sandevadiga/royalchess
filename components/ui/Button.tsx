import { memo } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import { FONT, RADIUS, SPACING } from '../../constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'cancel';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

function Button({
  onPress,
  title,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const { theme } = useTheme();

  const backgroundColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    outline: 'transparent',
    cancel: 'transparent',
  }[variant];

  const borderColor = {
    primary: 'transparent',
    secondary: 'transparent',
    outline: theme.colors.primary,
    cancel: 'transparent',
  }[variant];

  const textColor = {
    primary: theme.colors.background,
    secondary: theme.colors.background,
    outline: theme.colors.primary,
    cancel: theme.colors.textSecondary,
  }[variant];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 2 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.XL,
    borderRadius: RADIUS.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FONT.BASE,
    fontWeight: '700',
  },
});

export default memo(Button);
