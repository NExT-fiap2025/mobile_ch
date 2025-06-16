// app/portfolio/[id].tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { UserPortfolio } from '@/src/services/DataService';

// micro-componentes isolados
import LoadingView from '@/src/components/portfolio/LoadingView';
import EmptyView from '@/src/components/portfolio/EmptyView';
import PortfolioHeader from '@/src/components/portfolio/PortfolioHeader';
import PortfolioChart from '@/src/components/portfolio/PortfolioChart';
import PortfolioHoldings from '@/src/components/portfolio/PortfolioHoldings';
import ChatFAB from '@/src/components/portfolio/ChatFAB';

export default function PortfolioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await DataService.getPortfolio(id);
        setPortfolio(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingView />;
  if (!portfolio) return <EmptyView />;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <PortfolioHeader router={router} />
      <ScrollView contentContainerStyle={styles.content}>
        <PortfolioChart holdings={portfolio.holdings} />
        <PortfolioHoldings holdings={portfolio.holdings} />
      </ScrollView>
      <ChatFAB />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
});
