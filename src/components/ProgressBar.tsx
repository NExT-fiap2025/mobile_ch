import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  color,
  backgroundColor,
  style,
}) => {
  const theme = useTheme();

  const clampedProgress = Math.max(0, Math.min(100, progress));

  const containerStyle: ViewStyle = {
    height,
    backgroundColor: backgroundColor || theme.colors.border,
    borderRadius: height / 2,
    overflow: 'hidden',
  };

  const progressStyle: ViewStyle = {
    height: '100%',
    width: `${clampedProgress}%`,
    backgroundColor: color || theme.colors.primary,
    borderRadius: height / 2,
  };

  return (
    <View style={style}>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {Math.round(clampedProgress)}%
        </Text>
      )}
      <View style={containerStyle}>
        <View style={progressStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
});