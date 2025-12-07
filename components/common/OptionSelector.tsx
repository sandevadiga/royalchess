import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { SPACING, RADIUS, FONT } from '../../constants';

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

function OptionSelector({ options, selected, onSelect, style }: OptionSelectorProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
            selected === option.value && { 
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primary,
            }
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[
            styles.text,
            { color: theme.colors.textSecondary },
            selected === option.value && { color: theme.colors.background }
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
    padding: SPACING.MD,
    marginHorizontal: SPACING.XS,
    borderRadius: RADIUS.LG,
    borderWidth: 2,
    alignItems: 'center',
  },
  text: {
    fontSize: FONT.MD,
    fontWeight: '600',
  },
});

export default memo(OptionSelector);
