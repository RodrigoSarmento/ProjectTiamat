import { ImageBackground, ScrollView, Text, View } from 'react-native';

import { CloseButton } from '@components/close-button';
import { Collapsible } from '@components/collapsible';
import { translate } from '@helper/translate';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LORE_ENTRIES } from './Lore.constants';
import { styles } from './Lore.styles';

const Lore = () => {
  return (
    <ImageBackground
      style={CommonStyles.flex1}
      source={require('@assets/backgrounds/home_cyberpunk.png')}
    >
      <SafeAreaView style={CommonStyles.flex1} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={CommonStyles.settingsTitle}>
            {translate('words.lore')}
          </Text>
          <CloseButton />
          <View style={CommonStyles.settingsDivider} />
          <ScrollView contentContainerStyle={styles.list}>
            {LORE_ENTRIES.map((id) => (
              <Collapsible
                key={id}
                testID={`Lore-${id}`}
                title={translate(`lore.${id}.title`)}
                description={translate(`lore.${id}.description`)}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Lore;
