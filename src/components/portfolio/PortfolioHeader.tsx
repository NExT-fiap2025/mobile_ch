// src/components/portfolio/PortfolioHeader.tsx
import React from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import * as IconWeb from 'lucide-react';
import * as IconNative from 'lucide-react-native';
import type { Router } from 'expo-router';

const ArrowLeft =
  Platform.OS === 'web' ? IconWeb.ArrowLeft : IconNative.ArrowLeft;

interface Props {
  router: Router;
}

export default function PortfolioHeader({ router }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>Meu Portfólio</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacer: {
    width: 32,
  },
});
