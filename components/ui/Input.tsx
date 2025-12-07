import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { memo } from 'react';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
});

export default memo(Input);
