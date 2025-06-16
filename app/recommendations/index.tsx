import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { Portfolio } from '@/src/services/DataService';

export default function RecommendationsScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingPortfolio, setAcceptingPortfolio] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      const data = await DataService.getRecommendations(user.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPortfolio = async (portfolioId: string) => {
    if (!user) return;

    Alert.alert(
      'Aceitar Portfólio',
      'Tem certeza que deseja aceitar esta recomendação de portfólio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: async () => {
            setAcceptingPortfolio(portfolioId);
            
            try {
              await DataService.acceptPortfolio(user.id, portfolioId);
              
              Alert.alert(
                'Sucesso!',
                'Portfólio aceito com sucesso. Você pode visualizá-lo no dashboard.',
                [
                  {
                    text: 'Ver Dashboard',
                    onPress: () => router.replace('/(tabs)'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível aceitar o portfólio');
            } finally {
              setAcceptingPortfolio(null);
            }
          },
        },
      ]
    );
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'baixo':
        return theme.colors.success;
      case 'médio':
        return theme.colors.warning;
      case 'médio-alto':
        return theme.colors.error;
      case 'alto':
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  };

  const getRiskLevelVariant = (riskLevel: string): 'success' | 'warning' | 'error' => {
    switch (riskLevel) {
      case 'baixo':
        return 'success';
      case 'médio':
        return 'warning';
      default:
        return 'error';
    }
  };

  const renderPortfolioCard = ({ item }: { item: Portfolio }) => (
    <Card style={styles.portfolioCard}>
      {/* Header */}
      <View style={styles.portfolioHeader}>
        <View>
          <Text style={[styles.portfolioName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.portfolioMeta}>
            <Badge 
              text={item.riskLevel} 
              variant={getRiskLevelVariant(item.riskLevel)}
              size="small"
            />
            <Text style={[styles.expectedReturn, { color: theme.colors.textSecondary }]}>
              Retorno esperado: {item.expectedReturn}
            </Text>
          </View>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, { color: theme.colors.textSecondary }]}>
            Confiança
          </Text>
          <Text style={[styles.confidenceValue, { color: theme.colors.primary }]}>
            {Math.round(item.xaiExplanation.confidence * 100)}%
          </Text>
        </View>
      </View>

      {/* Allocation */}
      <View style={styles.allocationSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Alocação de Ativos
        </Text>
        <View style={styles.allocationGrid}>
          {Object.entries(item.allocation).map(([asset, percentage]) => (
            <View key={asset} style={styles.allocationItem}>
              <View style={styles.allocationBar}>
                <View 
                  style={[
                    styles.allocationFill,
                    { 
                      width: `${percentage}%`,
                      backgroundColor: theme.colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.assetName, { color: theme.colors.textSecondary }]}>
                {asset.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Text>
              <Text style={[styles.assetPercentage, { color: theme.colors.text }]}>
                {percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* XAI Explanation */}
      <View style={styles.explanationSection}>
        <View style={styles.explanationHeader}>
          <AlertCircle size={16} color={theme.colors.info} />
          <Text style={[styles.explanationTitle, { color: theme.colors.text }]}>
            Por que recomendamos este portfólio?
          </Text>
        </View>
        
        <Text style={[styles.reasoning, { color: theme.colors.textSecondary }]}>
          {item.xaiExplanation.reasoning}
        </Text>
        
        <View style={styles.factorsContainer}>
          <Text style={[styles.factorsTitle, { color: theme.colors.text }]}>
            Fatores considerados:
          </Text>
          {item.xaiExplanation.factors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <CheckCircle size={12} color={theme.colors.success} />
              <Text style={[styles.factorText, { color: theme.colors.textSecondary }]}>
                {factor}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <Button
        title={acceptingPortfolio === item.id ? "Aceitando..." : "Aceitar Portfólio"}
        onPress={() => handleAcceptPortfolio(item.id)}
        loading={acceptingPortfolio === item.id}
        style={styles.acceptButton}
      />
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
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
          Recomendações
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <TrendingUp size={20} color={theme.colors.primary} />
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Portfólios personalizados para seu perfil
        </Text>
      </View>

      {/* Recommendations List */}
      <FlatList
        data={recommendations}
        renderItem={renderPortfolioCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  portfolioCard: {
    marginBottom: 24,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  portfolioName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  portfolioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expectedReturn: {
    fontSize: 12,
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  allocationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  allocationGrid: {
    gap: 12,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  allocationBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  allocationFill: {
    height: '100%',
    borderRadius: 3,
  },
  assetName: {
    fontSize: 12,
    width: 80,
    textTransform: 'capitalize',
  },
  assetPercentage: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  explanationSection: {
    marginBottom: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  reasoning: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  factorsContainer: {
    marginTop: 8,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  acceptButton: {
    marginTop: 8,
  },
});