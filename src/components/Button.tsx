// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  // Constroi estilo base do botão
  const baseStyle: ViewStyle = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled || loading ? 0.6 : 1,
  };

  // Ajusta padding e altura conforme tamanho
  switch (size) {
    case 'small':
      baseStyle.paddingHorizontal = theme.spacing.md;
      baseStyle.paddingVertical = theme.spacing.sm;
      baseStyle.minHeight = 36;
      break;
    case 'large':
      baseStyle.paddingHorizontal = theme.spacing.xl;
      baseStyle.paddingVertical = theme.spacing.md;
      baseStyle.minHeight = 56;
      break;
    default:
      baseStyle.paddingHorizontal = theme.spacing.lg;
      baseStyle.paddingVertical = theme.spacing.md;
      baseStyle.minHeight = 48;
  }

  // Ajusta cores conforme variante
  switch (variant) {
    case 'secondary':
      baseStyle.backgroundColor = theme.colors.secondary;
      break;
    case 'outline':
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = theme.colors.primary;
      break;
    default:
      baseStyle.backgroundColor = theme.colors.primary;
  }

  // Texto
  const textBase: TextStyle = {
    ...theme.typography.button,
    textAlign: 'center',
    color: variant === 'outline' ? theme.colors.primary : '#FFFFFF',
  };
  if (variant === 'secondary') {
    textBase.color = theme.colors.text;
  }

  return (
    <TouchableOpacity
      style={[baseStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text style={[textBase, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
