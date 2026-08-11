import { ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './Game.styles';

const Game = () => {
  const navigation =
    useNavigation<StackNavigationProp<GameStackParamsList, 'Game'>>();

  return (
    <ImageBackground
      source={require('@assets/backgrounds/gameplay_page.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={CommonStyles.flex1}>
        <ImageButton
          source={require('@assets/buttons/button_bookmark_menu.png')}
          containerStyle={styles.bookmarkMenuContainer}
          style={styles.bookmarkMenuButton}
          resizeMode="cover"
          onPress={() => navigation.navigate('Menu')}
        />
        <ImageButton
          source={require('@assets/icons/icon_map.png')}
          containerStyle={styles.mapButtonContainer}
          style={styles.mapButton}
          resizeMode="cover"
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Game;
