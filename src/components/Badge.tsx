import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'warning':
        return theme.colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'large':
        return { paddingHorizontal: 12, paddingVertical: 6 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4 };
    }
  };

  const badgeStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: 12,
    alignSelf: 'flex-start',
    ...getPadding(),
  };

  const badgeTextStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: '600',
    textAlign: 'center',
  };

  return (
    <View style={[badgeStyle, style]}>
      <Text style={[badgeTextStyle, textStyle]}>{text}</Text>
    </View>
  );
};