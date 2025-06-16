export const colors = {
  light: {
    primary: '#0047AB',
    secondary: '#FFB200',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    border: '#DEE2E6',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
  },
  dark: {
    primary: '#4A90E2',
    secondary: '#FFD700',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof colors.light;