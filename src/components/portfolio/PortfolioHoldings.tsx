// src/components/portfolio/PortfolioHoldings.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { useTheme } from '@/src/hooks/useTheme';
import * as IconWeb from 'lucide-react';
import * as IconNative from 'lucide-react-native';
import { Platform } from 'react-native';

const TrendingUp =
  Platform.OS === 'web' ? IconWeb.TrendingUp : IconNative.TrendingUp;
const TrendingDown =
  Platform.OS === 'web' ? IconWeb.TrendingDown : IconNative.TrendingDown;

export interface Holding {
  id: string;
  name: string;
  type: string;
  value: number;
  percentage: number;
  performance: number;
}

interface Props {
  holdings: Holding[];
}

export default function PortfolioHoldings({ holdings }: Props) {
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Holding }) => (
    <View style={[styles.item, { borderBottomColor: colors.border }]}>
      <View style={styles.main}>
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            <Badge text={item.type} variant="primary" size="small" />
          </View>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            R${' '}
            {item.value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.percent, { color: colors.text }]}>
            {item.percentage}%
          </Text>
          <View style={styles.performance}>
            {item.performance >= 0 ? (
              <TrendingUp size={16} color={colors.success} />
            ) : (
              <TrendingDown size={16} color={colors.error} />
            )}
            <Text
              style={[
                styles.perfText,
                {
                  color: item.performance >= 0 ? colors.success : colors.error,
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

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>
        Ativos ({holdings.length})
      </Text>
      <FlatList
        data={holdings}
        renderItem={renderItem}
        keyExtractor={(h) => h.id}
        scrollEnabled={false}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  value: {
    fontSize: 14,
  },
  stats: {
    alignItems: 'flex-end',
  },
  percent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
