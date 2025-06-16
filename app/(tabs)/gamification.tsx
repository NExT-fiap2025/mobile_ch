import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Star, Target } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { ProgressBar } from '@/src/components/ProgressBar';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { Gamification, Badge as BadgeType, Achievement } from '@/src/services/DataService';

export default function GamificationScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [gamificationData, setGamificationData] = useState<Gamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGamificationData = async () => {
    if (!user) return;

    try {
      const data = await DataService.getGamification(user.id);
      setGamificationData(data);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGamificationData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadGamificationData();
  };

  const renderBadge = ({ item }: { item: BadgeType }) => (
    <Card style={styles.badgeCard}>
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{item.icon}</Text>
        <Badge text="Conquistado" variant="success" size="small" />
      </View>
      <Text style={[styles.badgeName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.badgeDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
      <Text style={[styles.badgeDate, { color: theme.colors.textSecondary }]}>
        {new Date(item.earnedAt).toLocaleDateString('pt-BR')}
      </Text>
    </Card>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <Card style={styles.achievementCard}>
      <View style={styles.achievementHeader}>
        <Target size={24} color={theme.colors.primary} />
        <Text style={[styles.achievementReward, { color: theme.colors.secondary }]}>
          +{item.reward} pts
        </Text>
      </View>
      <Text style={[styles.achievementName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
      <View style={styles.progressSection}>
        <ProgressBar
          progress={(item.progress / item.target) * 100}
          showLabel
          style={styles.achievementProgress}
        />
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {item.progress}/{item.target}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!gamificationData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyState}>
          <Trophy size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Dados de gamificação não encontrados
          </Text>
        </View>
      </SafeAreaView>
    );
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
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Conquistas
          </Text>
          <Trophy size={32} color={theme.colors.secondary} />
        </View>

        {/* Level Overview */}
        <Card style={styles.levelOverview}>
          <View style={styles.levelInfo}>
            <View style={styles.levelBadgeContainer}>
              <Text style={styles.levelNumber}>{gamificationData.level}</Text>
            </View>
            <View style={styles.levelDetails}>
              <Text style={[styles.levelTitle, { color: theme.colors.text }]}>
                Nível {gamificationData.level}
              </Text>
              <Text style={[styles.totalPoints, { color: theme.colors.textSecondary }]}>
                {gamificationData.totalPoints.toLocaleString('pt-BR')} pontos totais
              </Text>
            </View>
          </View>
          
          <View style={styles.nextLevelSection}>
            <Text style={[styles.nextLevelText, { color: theme.colors.textSecondary }]}>
              Próximo nível em:
            </Text>
            <ProgressBar
              progress={((4000 - gamificationData.pointsToNextLevel) / 4000) * 100}
              showLabel
              style={styles.levelProgress}
            />
            <Text style={[styles.pointsToNext, { color: theme.colors.text }]}>
              {gamificationData.pointsToNextLevel.toLocaleString('pt-BR')} pontos restantes
            </Text>
          </View>
        </Card>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Badges Conquistados ({gamificationData.badges.length})
            </Text>
          </View>
          
          <FlatList
            data={gamificationData.badges}
            renderItem={renderBadge}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesList}
          />
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Objetivos em Progresso
            </Text>
          </View>
          
          {gamificationData.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              {renderAchievement({ item: achievement })}
            </View>
          ))}
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  levelOverview: {
    marginBottom: 32,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadgeContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0047AB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelDetails: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalPoints: {
    fontSize: 14,
  },
  nextLevelSection: {
    marginTop: 16,
  },
  nextLevelText: {
    fontSize: 14,
    marginBottom: 8,
  },
  levelProgress: {
    marginBottom: 8,
  },
  pointsToNext: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  badgesList: {
    paddingVertical: 8,
  },
  badgeCard: {
    width: 180,
    marginRight: 12,
    alignItems: 'center',
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDate: {
    fontSize: 10,
    textAlign: 'center',
  },
  achievementItem: {
    marginBottom: 12,
  },
  achievementCard: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementReward: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  achievementProgress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});