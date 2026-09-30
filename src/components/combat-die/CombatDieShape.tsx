import React from 'react';

import type { CombatDieSides } from '@helper/combatDice';
import Svg, { Polygon, Rect } from 'react-native-svg';

type ICombatDieShape = {
  sides: CombatDieSides;
  size: number;
  fill: string;
  stroke: string;
};

const CombatDieShape: React.FC<ICombatDieShape> = ({
  sides,
  size,
  fill,
  stroke,
}) => {
  const strokeWidth = Math.max(2, size * 0.025);

  if (sides === 4) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Polygon
          points="32,4 60,58 4,58"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (sides === 8) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Polygon
          points="32,3 61,32 32,61 3,32"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect
        x={5}
        y={5}
        width={54}
        height={54}
        rx={8}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};

export default CombatDieShape;
