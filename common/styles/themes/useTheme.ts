import { useAppSelector } from '../../../services/hooks';
import { themes } from './index';

export const useTheme = () => {
  const currentThemeMode = useAppSelector(state => state.theme.current.mode);
  
  // Auto detect system theme if mode is 'auto'
  const getThemeMode = () => {
    if (currentThemeMode === 'auto') {
      // For now, default to light. Later can add system detection
      return 'light';
    }
    return currentThemeMode;
  };
  
  const themeMode = getThemeMode();
  const theme = themes[themeMode];
  
  return {
    theme,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};