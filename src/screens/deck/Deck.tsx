import { ImageBackground, Text, View } from 'react-native';

import { CloseButton } from '@components/close-button';
import { translate } from '@helper/translate';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './Deck.styles';

const Deck = () => {
  return (
    <ImageBackground
      style={CommonStyles.flex1}
      source={require('@assets/backgrounds/home_cyberpunk.png')}
    >
      <SafeAreaView style={CommonStyles.flex1} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={CommonStyles.settingsTitle}>
            {translate('words.deck')}
          </Text>
          <CloseButton />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Deck;
