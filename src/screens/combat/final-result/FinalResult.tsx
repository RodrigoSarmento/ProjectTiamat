import { Pressable, Text } from 'react-native';

import type { ICombatStep } from '../Combat.types';

import { styles } from './FinalResult.styles';

const FinalResult = ({ combatRef }: ICombatStep) => (
  <Pressable
    testID="CombatFinalResult"
    onPress={() => combatRef.current?.next()}
    style={styles.container}
  >
    <Text style={styles.label}>FinalResult</Text>
  </Pressable>
);

export default FinalResult;
