// app/portfolio/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import DataService, { Portfolio } from '@/src/services/DataService';
import { Card } from '@/src/components/Card';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';

const { width } = Dimensions.get('window');

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
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.primary,
                  alignSelf: 'stretch',
                  width: width - 32,
                },
              ]}
              onPress={async () => {
                if (!user) return;
                await DataService.acceptPortfolio(user.id, item.id);
                // navegação string para garantir id no web
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
  container: { flex: 1 },
  list: { padding: 16 },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    width: width - 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: { marginBottom: 16 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  detail: { fontSize: 14, marginBottom: 4 },
  button: {
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 14, fontWeight: '500' },
});
