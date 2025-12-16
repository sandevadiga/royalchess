/**
 * Modern Theme System with Glassmorphism
 */

import { COLORS, DESIGN_TOKENS } from '../designSystem';

export interface ModernTheme {
  colors: {
    // Surface Colors
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceOverlay: string;

    // Glass Colors
    glassLight: string;
    glassMedium: string;
    glassDark: string;

    // Text Colors
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;

    // Border Colors
    border: string;
    borderLight: string;
    borderStrong: string;

    // Brand Colors
    primary: string;
    primaryLight: string;
    primaryDark: string;

    secondary: string;
    secondaryLight: string;
    secondaryDark: string;

    // Semantic Colors
    success: string;
    error: string;
    warning: string;
    info: string;

    // Interactive States
    hover: string;
    pressed: string;
    focus: string;
    disabled: string;
  };

  spacing: typeof DESIGN_TOKENS.spacing;
  typography: typeof DESIGN_TOKENS.typography;
  radius: typeof DESIGN_TOKENS.radius;
  shadows: typeof DESIGN_TOKENS.shadows;
  animation: typeof DESIGN_TOKENS.animation;
  glass: typeof DESIGN_TOKENS.glass;
  layout: typeof DESIGN_TOKENS.layout;
  zIndex: typeof DESIGN_TOKENS.zIndex;
}

export const lightTheme: ModernTheme = {
  colors: {
    // Surface Colors
    background: COLORS.neutral[50],
    surface: COLORS.neutral[0],
    surfaceElevated: COLORS.neutral[0],
    surfaceOverlay: 'rgba(0, 0, 0, 0.5)',

    // Glass Colors
    glassLight: 'rgba(255, 255, 255, 0.7)',
    glassMedium: 'rgba(255, 255, 255, 0.5)',
    glassDark: 'rgba(255, 255, 255, 0.3)',

    // Text Colors
    textPrimary: COLORS.neutral[900],
    textSecondary: COLORS.neutral[600],
    textTertiary: COLORS.neutral[400],
    textInverse: COLORS.neutral[0],

    // Border Colors
    border: COLORS.neutral[200],
    borderLight: COLORS.neutral[100],
    borderStrong: COLORS.neutral[300],

    // Brand Colors
    primary: COLORS.primary[600],
    primaryLight: COLORS.primary[400],
    primaryDark: COLORS.primary[700],

    secondary: '#6366F1',
    secondaryLight: '#818CF8',
    secondaryDark: '#4F46E5',

    // Semantic Colors
    success: COLORS.success.main,
    error: COLORS.error.main,
    warning: COLORS.warning.main,
    info: COLORS.info.main,

    // Interactive States
    hover: 'rgba(0, 0, 0, 0.04)',
    pressed: 'rgba(0, 0, 0, 0.08)',
    focus: COLORS.primary[500],
    disabled: COLORS.neutral[300],
  },

  spacing: DESIGN_TOKENS.spacing,
  typography: DESIGN_TOKENS.typography,
  radius: DESIGN_TOKENS.radius,
  shadows: DESIGN_TOKENS.shadows,
  animation: DESIGN_TOKENS.animation,
  glass: DESIGN_TOKENS.glass,
  layout: DESIGN_TOKENS.layout,
  zIndex: DESIGN_TOKENS.zIndex,
};

export const darkTheme: ModernTheme = {
  colors: {
    // Surface Colors
    background: COLORS.neutral[950],
    surface: COLORS.neutral[900],
    surfaceElevated: COLORS.neutral[800],
    surfaceOverlay: 'rgba(0, 0, 0, 0.7)',

    // Glass Colors
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassMedium: 'rgba(255, 255, 255, 0.05)',
    glassDark: 'rgba(0, 0, 0, 0.5)',

    // Text Colors
    textPrimary: COLORS.neutral[50],
    textSecondary: COLORS.neutral[400],
    textTertiary: COLORS.neutral[600],
    textInverse: COLORS.neutral[900],

    // Border Colors
    border: COLORS.neutral[700],
    borderLight: COLORS.neutral[800],
    borderStrong: COLORS.neutral[600],

    // Brand Colors
    primary: COLORS.primary[500],
    primaryLight: COLORS.primary[400],
    primaryDark: COLORS.primary[600],

    secondary: '#818CF8',
    secondaryLight: '#A5B4FC',
    secondaryDark: '#6366F1',

    // Semantic Colors
    success: COLORS.success.light,
    error: COLORS.error.light,
    warning: COLORS.warning.light,
    info: COLORS.info.light,

    // Interactive States
    hover: 'rgba(255, 255, 255, 0.08)',
    pressed: 'rgba(255, 255, 255, 0.12)',
    focus: COLORS.primary[400],
    disabled: COLORS.neutral[700],
  },

  spacing: DESIGN_TOKENS.spacing,
  typography: DESIGN_TOKENS.typography,
  radius: DESIGN_TOKENS.radius,
  shadows: DESIGN_TOKENS.shadows,
  animation: DESIGN_TOKENS.animation,
  glass: DESIGN_TOKENS.glass,
  layout: DESIGN_TOKENS.layout,
  zIndex: DESIGN_TOKENS.zIndex,
};

export const modernThemes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ModernThemeMode = keyof typeof modernThemes;
