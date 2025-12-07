import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { SPACING, RADIUS, FONT } from '../../constants';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

function Input({ style, ...props }: InputProps) {
  const { theme } = useTheme();
  
  return (
    <TextInput
      style={[
        styles.input, 
        { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
        },
        style
      ]}
      placeholderTextColor={theme.colors.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.LG,
    padding: SPACING.MD,
    fontSize: FONT.BASE,
  },
});

export default memo(Input);
