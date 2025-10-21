import { createContext, useContext } from 'react';
import type { ColorSchemeName } from 'react-native';
import type { ThemePalette } from './palette';
import { lightPalette } from './palette';

export type ThemeContextValue = {
  scheme: ColorSchemeName;
  theme: ThemePalette;
  toggleScheme: () => void;
};

const defaultValue: ThemeContextValue = {
  scheme: 'light',
  theme: lightPalette,
  toggleScheme: () => {}
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = () => useContext(ThemeContext);
