// app/portfolio/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import DataService, { Portfolio } from '@/src/services/DataService';
import { Card } from '@/src/components/Card';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import * as IconWeb from 'lucide-react';
import * as IconNative from 'lucide-react-native';

const ArrowLeft =
  Platform.OS === 'web' ? IconWeb.ArrowLeft : IconNative.ArrowLeft;

export default function PortfolioListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [recs, setRecs] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const recommendations = await DataService.getRecommendations(user.id);
        setRecs(recommendations);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.iconButton}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Meus Portfólios
        </Text>
        <View style={styles.iconButton} />
      </View>

      <FlatList
        data={recs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.detail, { color: theme.colors.textSecondary }]}
              >
                Risco: {item.riskLevel}
              </Text>
              <Text
                style={[styles.detail, { color: theme.colors.textSecondary }]}
              >
                Retorno esperado: {item.expectedReturn}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={async () => {
                if (!user) return;
                await DataService.acceptPortfolio(user.id, item.id);
                router.push(`/portfolio/${user.id}`);
              }}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                Aceitar e ver portfólio
              </Text>
            </TouchableOpacity>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    width: '80%', // 80% da largura da tela
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
