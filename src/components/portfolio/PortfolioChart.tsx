// src/components/portfolio/PortfolioChart.tsx
import React from 'react';
import { Platform, View, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

// no web, usamos o pacote 'victory'
import { VictoryPie as VictoryWebPie } from 'victory';
// no mobile, usamos 'victory-native'
import { VictoryPie as VictoryNativePie } from 'victory-native';

const { width } = Dimensions.get('window');
const VictoryPie = Platform.OS === 'web' ? VictoryWebPie : VictoryNativePie;

export interface Holding {
  name: string;
  percentage: number;
}

interface Props {
  holdings: Holding[];
}

export default function PortfolioChart({ holdings }: Props) {
  const { colors } = useTheme();
  const data = holdings.map((h) => ({ x: h.name, y: h.percentage }));

  return (
    <View style={styles.wrapper}>
      <VictoryPie
        data={data}
        width={width - 80}
        height={250}
        innerRadius={60}
        labelRadius={({ innerRadius }: { innerRadius: number }) =>
          innerRadius + 40
        }
        colorScale={[
          colors.primary,
          colors.secondary,
          colors.success,
          colors.info,
          colors.warning,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
});
