import { View, Text, StyleSheet } from 'react-native';
import { memo } from 'react';

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = 'Coming Soon' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
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
    fontSize: 18,
    color: '#666',
  },
});

export default memo(EmptyState);
