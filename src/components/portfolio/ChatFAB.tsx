// src/components/portfolio/ChatFAB.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as IconWeb from 'lucide-react';
import * as IconNative from 'lucide-react-native';

const MessageCircle =
  Platform.OS === 'web' ? IconWeb.MessageCircle : IconNative.MessageCircle;

export default function ChatFAB() {
  return (
    <TouchableOpacity style={styles.fab} onPress={() => console.log('chat')}>
      <MessageCircle size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF', // adjust or come from theme
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
