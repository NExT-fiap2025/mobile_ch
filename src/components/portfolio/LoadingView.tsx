import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';

export default function LoadingView() {
  return (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
