// src/components/portfolio/EmptyView.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export default function EmptyView() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.inner}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Nenhum portfólio encontrado
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
