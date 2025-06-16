// src/types/victory-native.d.ts
import * as React from 'react';

declare module 'victory-native' {
  interface VictoryPieProps {
    data: any[];
    width?: number;
    height?: number;
    innerRadius?: number;
    labelRadius?: number | ((props: any) => number);
    labelComponent?: React.ReactElement;
    colorScale?: (string | number)[];
  }

  export class VictoryPie extends React.Component<VictoryPieProps> {}
}
