import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { SPACING, RADIUS, FONT } from '../../constants';

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
  disabled = false 
}: ButtonProps) {
  const { theme } = useTheme();
  
  const variantStyles = {
    primary: { backgroundColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.primary },
    cancel: { backgroundColor: 'transparent' },
  };

  const textStyles = {
    primary: { color: theme.colors.background },
    secondary: { color: theme.colors.background },
    outline: { color: theme.colors.primary },
    cancel: { color: theme.colors.textSecondary },
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyles[variant], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: SPACING.XXL,
    paddingVertical: SPACING.LG,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FONT.BASE,
    fontWeight: 'bold',
  },
});

export default memo(Button);
