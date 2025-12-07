import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}

export default function OptionSelector({ options, selected, onSelect, style }: OptionSelectorProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            selected === option.value && styles.selected
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[
            styles.text,
            selected === option.value && styles.selectedText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  selected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  selectedText: {
    color: 'white',
  },
});
