import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import { FONT, RADIUS, SPACING } from '../../constants';

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
    <View style={[styles.container, { backgroundColor: theme.colors.border }, style]}>
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.85}
            style={[
              styles.option,
              {
                backgroundColor: isActive ? theme.colors.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isActive ? '#fff' : theme.colors.textSecondary },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: RADIUS.XL,
    padding: SPACING.XS,
  },
  option: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.LG,
    alignItems: 'center',
  },
  text: {
    fontSize: FONT.MD,
    fontWeight: '600',
  },
});

export default memo(OptionSelector);
