import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MessageCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, {
  UserPortfolio,
  Holding,
} from '@/src/services/DataService';
import { VictoryPie } from 'victory-native';

const { width } = Dimensions.get('window');

export default function PortfolioDetailScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const data = await DataService.getPortfolio(user.id);
        setPortfolio(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const getPieChartData = () =>
    portfolio?.holdings.map((h) => ({ x: h.name, y: h.percentage })) || [];

  const renderHoldingItem = ({ item }: { item: Holding }) => (
    <View
      style={[styles.holdingItem, { borderBottomColor: theme.colors.border }]}
    >
      <View style={styles.holdingMain}>
        <View style={styles.holdingInfo}>
          <View style={styles.holdingHeader}>
            <Text style={[styles.holdingName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Badge text={item.type} variant="primary" size="small" />
          </View>
          <Text
            style={[styles.holdingValue, { color: theme.colors.textSecondary }]}
          >
            R${' '}
            {item.value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.holdingStats}>
          <Text
            style={[styles.holdingPercentage, { color: theme.colors.text }]}
          >
            {item.percentage}%
          </Text>
          <View style={styles.performanceContainer}>
            {item.performance >= 0 ? (
              <TrendingUp size={16} color={theme.colors.success} />
            ) : (
              <TrendingDown size={16} color={theme.colors.error} />
            )}
            <Text
              style={[
                styles.holdingPerformance,
                {
                  color:
                    item.performance >= 0
                      ? theme.colors.success
                      : theme.colors.error,
                },
              ]}
            >
              {item.performance.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) return <LoadingSpinner />;

  if (!portfolio) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyState}>
          <Text
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            Nenhum portfólio encontrado
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Meu Portfólio
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pie Chart */}
        <View style={styles.chartWrapper}>
          <VictoryPie
            data={getPieChartData()}
            width={width - 80}
            height={250}
            innerRadius={60}
            labelRadius={({ innerRadius }: { innerRadius: number }) =>
              innerRadius + 40
            }
            colorScale={[
              theme.colors.primary,
              theme.colors.secondary,
              theme.colors.success,
              theme.colors.info,
              theme.colors.warning,
            ]}
          />
        </View>

        {/* Holdings List */}
        <Card style={styles.holdingsCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Ativos ({portfolio.holdings.length})
          </Text>
          <FlatList
            data={portfolio.holdings}
            renderItem={renderHoldingItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </Card>
      </ScrollView>

      {/* Chat FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log('chat')}
      >
        <MessageCircle size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 32 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  chartWrapper: { alignItems: 'center', marginBottom: 16 },
  holdingsCard: { marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  holdingItem: { paddingVertical: 16, borderBottomWidth: 1 },
  holdingMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holdingInfo: { flex: 1 },
  holdingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  holdingName: { fontSize: 16, fontWeight: '600', marginRight: 8 },
  holdingValue: { fontSize: 14 },
  holdingStats: { alignItems: 'flex-end' },
  holdingPercentage: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  performanceContainer: { flexDirection: 'row', alignItems: 'center' },
  holdingPerformance: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16 },
});
