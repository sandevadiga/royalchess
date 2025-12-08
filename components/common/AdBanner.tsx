import { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';

interface AdBannerProps {
  style?: ViewStyle;
}

function AdBanner({ style }: AdBannerProps) {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border || '#E0E0E0',
      },
      style
    ]}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Advertisement
      </Text>
      <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
        Ad Space 320x50
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  placeholder: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
});

export default memo(AdBanner);
