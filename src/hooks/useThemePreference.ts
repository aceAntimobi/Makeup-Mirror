import { useState, useMemo } from 'react';
import { ColorSchemeName } from 'react-native';
import { darkPalette, lightPalette } from '../theme/palette';

export const useThemePreference = () => {
  const [scheme, setScheme] = useState<ColorSchemeName>('light');

  const theme = useMemo(() => (scheme === 'dark' ? darkPalette : lightPalette), [scheme]);

  const toggleScheme = () => {
    setScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { scheme, theme, toggleScheme };
};
