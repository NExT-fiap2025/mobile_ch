import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react-native';
import { VictoryPie } from 'victory-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { UserPortfolio, Holding } from '@/src/services/DataService';

const { width } = Dimensions.get('window');

export default function PortfolioDetailScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, [user]);

  const loadPortfolio = async () => {
    if (!user) return;

    try {
      const data = await DataService.getPortfolio(user.id);
      setPortfolio(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPieChartData = () => {
    if (!portfolio) return [];

    const colors = ['#0047AB', '#FFB200', '#28A745', '#17A2B8', '#6F42C1'];
    
    return portfolio.holdings.map((holding, index) => ({
      x: holding.name,
      y: holding.percentage,
      fill: colors[index % colors.length],
    }));
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'rendaFixa':
        return theme.colors.success;
      case 'acoes':
        return theme.colors.primary;
      case 'fundosImobiliarios':
        return theme.colors.warning;
      case 'internacional':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getAssetTypeName = (type: string) => {
    switch (type) {
      case 'rendaFixa':
        return 'Renda Fixa';
      case 'acoes':
        return 'Ações';
      case 'fundosImobiliarios':
        return 'FIIs';
      case 'internacional':
        return 'Internacional';
      default:
        return type;
    }
  };

  const renderHoldingItem = ({ item }: { item: Holding }) => (
    <View style={[styles.holdingItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.holdingMain}>
        <View style={styles.holdingInfo}>
          <View style={styles.holdingHeader}>
            <Text style={[styles.holdingName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Badge 
              text={getAssetTypeName(item.type)}
              variant="primary"
              size="small"
            />
          </View>
          <Text style={[styles.holdingValue, { color: theme.colors.textSecondary }]}>
            R$ {item.value.toLocaleString('pt-BR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </Text>
        </View>
        
        <View style={styles.holdingStats}>
          <Text style={[styles.holdingPercentage, { color: theme.colors.text }]}>
            {item.percentage}%
          </Text>
          <View style={styles.performanceContainer}>
            {item.performance >= 0 ? (
              <TrendingUp size={16} color={theme.colors.success} />
            ) : (
              <TrendingDown size={16} color={theme.colors.error} />
            )}
            <Text style={[
              styles.holdingPerformance,
              { color: item.performance >= 0 ? theme.colors.success : theme.colors.error }
            ]}>
              {item.performance >= 0 ? '+' : ''}{item.performance.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleChat = () => {
    // Placeholder for chat functionality
    console.log('Chat functionality would be implemented here');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!portfolio) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Nenhum portfólio encontrado
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
        {/* Portfolio Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Valor Total
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                R$ {portfolio.totalValue.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </Text>
            </View>
          </View>

          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.colors.textSecondary }]}>
                Hoje
              </Text>
              <Text style={[
                styles.performanceValue,
                { color: portfolio.performance.daily >= 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {portfolio.performance.daily >= 0 ? '+' : ''}{portfolio.performance.daily.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.colors.textSecondary }]}>
                Mês
              </Text>
              <Text style={[
                styles.performanceValue,
                { color: portfolio.performance.monthly >= 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {portfolio.performance.monthly >= 0 ? '+' : ''}{portfolio.performance.monthly.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={[styles.performanceLabel, { color: theme.colors.textSecondary }]}>
                Ano
              </Text>
              <Text style={[
                styles.performanceValue,
                { color: portfolio.performance.yearly >= 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {portfolio.performance.yearly >= 0 ? '+' : ''}{portfolio.performance.yearly.toFixed(2)}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Allocation Chart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Distribuição de Ativos
          </Text>
          
          <View style={styles.chartContainer}>
            <VictoryPie
              data={getPieChartData()}
              width={width - 80}
              height={250}
              innerRadius={60}
              labelRadius={({ innerRadius }) => innerRadius + 40}
              labelComponent={<></>}
              colorScale={['#0047AB', '#FFB200', '#28A745', '#17A2B8', '#6F42C1']}
            />
          </View>

          <View style={styles.legendContainer}>
            {portfolio.holdings.map((holding, index) => (
              <View key={holding.id} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor,
                    { backgroundColor: ['#0047AB', '#FFB200', '#28A745', '#17A2B8', '#6F42C1'][index % 5] }
                  ]} 
                />
                <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                  {holding.name} ({holding.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </Card>

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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleChat}
      >
        <MessageCircle size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    alignSelf: 'stretch',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  holdingsCard: {
    marginBottom: 20,
  },
  holdingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  holdingMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  holdingName: {
    fontSize: 16,
    fontWeight: '600',
  },
  holdingValue: {
    fontSize: 14,
  },
  holdingStats: {
    alignItems: 'flex-end',
  },
  holdingPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingPerformance: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});