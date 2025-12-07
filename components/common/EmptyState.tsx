import { View, Text, StyleSheet } from 'react-native';
import { memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { FONT } from '../../constants';

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = 'Coming Soon' }: EmptyStateProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: FONT.LG,
  },
});

export default memo(EmptyState);
