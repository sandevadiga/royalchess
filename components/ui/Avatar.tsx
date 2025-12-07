import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  isActive?: boolean;
  style?: ViewStyle;
}

export default function Avatar({ name, size = 40, isActive = false, style }: AvatarProps) {
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : 'A';
  
  return (
    <View 
      style={[
        styles.avatar, 
        { width: size, height: size, borderRadius: size / 2 },
        isActive && styles.active,
        style
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    borderWidth: 3,
    borderColor: '#FF0000',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});
