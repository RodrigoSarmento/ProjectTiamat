import { ImageBackground, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { storyText } from '@helper/storyText';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './Start.styles';

const Start = () => {
  const navigation =
    useNavigation<StackNavigationProp<GameStackParamsList, 'Start'>>();

  const handleStart = () => {
    navigation.replace('Game');
  };

  return (
    <ImageBackground
      source={require('@assets/backgrounds/home_cyberpunk.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={CommonStyles.flex1}>
        <View style={styles.content}>
          <ImageButton
            source={require('@assets/buttons/button_start.png')}
            text={storyText('chrome.start')}
            textStyle={styles.startButtonText}
            style={styles.startButton}
            onPress={handleStart}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Start;
