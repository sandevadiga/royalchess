/**
 * Modern Theme Hook
 */

import { useColorScheme } from 'react-native';
import { useAppSelector } from '../../../services/hooks';
import { modernThemes, ModernTheme } from './modernTheme';

export const useModernTheme = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector(state => state.theme.current.mode);

  const getActiveTheme = (): ModernTheme => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? modernThemes.dark : modernThemes.light;
    }
    return modernThemes[themeMode] || modernThemes.light;
  };

  const theme = getActiveTheme();
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  return {
    theme,
    isDark,
    isLight: !isDark,
  };
};
