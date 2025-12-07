import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { LAYOUT } from '../../constants';

interface AvatarProps {
  name: string;
  size?: number;
  isActive?: boolean;
  style?: ViewStyle;
}

function Avatar({ name, size = LAYOUT.AVATAR_SIZE_DEFAULT, isActive = false, style }: AvatarProps) {
  const { theme } = useTheme();
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : 'A';
  
  return (
    <View 
      style={[
        styles.avatar, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: theme.colors.primary,
        },
        isActive && { borderWidth: 3, borderColor: theme.colors.error },
        style
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4, color: theme.colors.background }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default memo(Avatar);
