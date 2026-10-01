import React from 'react';

import Svg, { Circle, Path } from 'react-native-svg';

import type { ICombatantSilhouette } from './CombatantCard.types';

const CombatantSilhouette: React.FC<ICombatantSilhouette> = ({
  size,
  color,
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx={32} cy={24} r={11} fill="none" stroke={color} strokeWidth={2} />
    <Path
      d="M10 62 C10 46 20 39 32 39 C44 39 54 46 54 62"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

export default CombatantSilhouette;
