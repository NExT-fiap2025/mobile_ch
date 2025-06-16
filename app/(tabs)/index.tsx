import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Star, ArrowRight, Trophy } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { UserPortfolio, Gamification } from '@/src/services/DataService';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [portfolioData, gamificationData] = await Promise.all([
        DataService.getPortfolio(user.id),
        DataService.getGamification(user.id),
      ]);

      setPortfolio(portfolioData);
      setGamification(gamificationData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleGetRecommendation = () => {
    router.push('/recommendations');
  };

  const handleViewPortfolio = () => {
    router.push('/portfolio');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Olá,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name}
            </Text>
          </View>
          {gamification && (
            <View style={styles.levelBadge}>
              <Badge
                text={`Nível ${gamification.level}`}
                variant="primary"
                size="large"
              />
            </View>
          )}
        </View>

        {/* Balance Card */}
        {portfolio ? (
          <Card style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
                Saldo Total
              </Text>
              <TrendingUp 
                size={24} 
                color={portfolio.performance.daily >= 0 ? theme.colors.success : theme.colors.error} 
              />
            </View>
            <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>
              R$ {portfolio.totalValue.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </Text>
            <View style={styles.performanceRow}>
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
            
            <Button
              title="Ver Portfólio"
              onPress={handleViewPortfolio}
              variant="outline"
              style={styles.portfolioButton}
            />
          </Card>
        ) : (
          <Card style={styles.welcomeCard}>
            <Star size={48} color={theme.colors.secondary} style={styles.welcomeIcon} />
            <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
              Bem-vindo ao XP Assessor Virtual!
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
              Descubra o portfólio ideal para seus objetivos de investimento
            </Text>
            <Button
              title="Obter Recomendação"
              onPress={handleGetRecommendation}
              style={styles.recommendationButton}
            />
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Ações Rápidas
          </Text>
          
          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: theme.colors.surface }]}
            onPress={handleGetRecommendation}
          >
            <TrendingUp size={24} color={theme.colors.primary} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Nova Recomendação
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                Obtenha sugestões personalizadas
              </Text>
            </View>
            <ArrowRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push('/(tabs)/gamification')}
          >
            <Trophy size={24} color={theme.colors.secondary} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Conquistas
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                Veja seus badges e progresso
              </Text>
            </View>
            <ArrowRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        {gamification && (
          <Card style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={[styles.levelTitle, { color: theme.colors.text }]}>
                Nível {gamification.level}
              </Text>
              <Text style={[styles.levelPoints, { color: theme.colors.textSecondary }]}>
                {gamification.totalPoints} pontos
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: theme.colors.primary,
                      width: `${((4000 - gamification.pointsToNextLevel) / 4000) * 100}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {gamification.pointsToNextLevel} pontos para o próximo nível
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelBadge: {
    alignItems: 'flex-end',
  },
  balanceCard: {
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  portfolioButton: {
    marginTop: 8,
  },
  welcomeCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  recommendationButton: {
    width: '100%',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  levelCard: {
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelPoints: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});