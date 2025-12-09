const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F5F5F7',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9FB',
    surfaceHover: '#E8E8ED',
    card: '#FFFFFF',
    text: '#1D1D1F',
    textSecondary: '#86868B',
    textTertiary: '#B0B0B5',
    border: '#D2D2D7',
    borderLight: '#E5E5EA',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

const darkTheme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    surfaceHover: '#3A3A3C',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    border: '#38383A',
    borderLight: '#48484A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#64D2FF',
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export { darkTheme, lightTheme };
