export type ThemePalette = {
  primary: string;
  background: string;
  accent: string;
  surface: string;
  surfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
};

export const lightPalette: ThemePalette = {
  primary: '#FECDD3',
  background: '#FFF7FB',
  accent: '#F9A8D4',
  surface: '#FFFFFF',
  surfaceVariant: '#FFE4F0',
  textPrimary: '#4A2C2A',
  textSecondary: '#815555',
  success: '#4CAF93',
  warning: '#FBBF24'
};

export const darkPalette: ThemePalette = {
  primary: '#F77ABF',
  background: '#1F1A24',
  accent: '#F472B6',
  surface: '#2B2531',
  surfaceVariant: '#3A3041',
  textPrimary: '#F9EAF3',
  textSecondary: '#D6C2CE',
  success: '#76E0C4',
  warning: '#FACC15'
};

export const palette = lightPalette;

export const shadows = {
  soft: {
    shadowColor: '#F9A8D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12
  },
  floating: {
    shadowColor: '#F472B6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16
  }
} as const;

export const spacing = (value: number) => value * 8;
