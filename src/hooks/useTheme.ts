import { useColorScheme } from 'react-native';
import { colors, ColorScheme, ThemeColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface Theme {
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme() as ColorScheme;
  const isDark = colorScheme === 'dark';
  
  return {
    colors: colors[colorScheme || 'light'],
    typography,
    spacing,
    isDark,
  };
};