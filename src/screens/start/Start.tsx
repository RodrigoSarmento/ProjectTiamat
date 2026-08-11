import { ImageBackground, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { RootState } from '@redux/store';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { styles } from './Start.styles';

const Start = () => {
  const navigation =
    useNavigation<StackNavigationProp<GameStackParamsList, 'Start'>>();

  const { save } = useSelector((state: RootState) => state.saves);

  const handleStart = () => {
    if (save) {
      navigation.navigate('Game');
    } else {
      navigation.navigate('CharacterCreation');
    }
  };

  return (
    <ImageBackground
      source={require('@assets/backgrounds/home_gem_ruins.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={CommonStyles.flex1}>
        <View style={styles.content}>
          <ImageButton
            source={require('@assets/buttons/button_start_plaque.png')}
            text="Start"
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
