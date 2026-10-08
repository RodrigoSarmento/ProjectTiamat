import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { ImageButton } from '@components/image-button';
import { translate } from '@helper/translate';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BACKGROUNDS } from './BackgroundSelect.constants';
import { useBackgroundSelect } from './BackgroundSelect.hooks';
import { styles } from './BackgroundSelect.styles';
import type { IBackgroundOption } from './BackgroundSelect.types';

const BackgroundSelect = () => {
  const {
    listRef,
    activeIndex,
    getItemLayout,
    onMomentumScrollEnd,
    goTo,
    choose,
  } = useBackgroundSelect();

  const renderBackground = ({
    item,
  }: ListRenderItemInfo<IBackgroundOption>) => (
    <View testID={`BackgroundSelect-${item.id}`} style={styles.page}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{translate(`words.${item.id}`)}</Text>
      <ScrollView
        style={CommonStyles.flex1}
        contentContainerStyle={styles.descriptionContent}
      >
        <Text style={styles.description}>
          {translate(`backgrounds.${item.id}`)}
        </Text>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={CommonStyles.flex1}>
        <Text style={styles.title}>{translate('backgroundSelect.title')}</Text>
        <FlatList
          ref={listRef}
          testID="BackgroundSelect-list"
          data={BACKGROUNDS}
          keyExtractor={(item) => item.id}
          renderItem={renderBackground}
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={onMomentumScrollEnd}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={CommonStyles.flex1}
        />
        <View style={styles.dots}>
          {BACKGROUNDS.map((background, index) => (
            <Pressable
              key={background.id}
              testID={`BackgroundSelect-dot-${background.id}`}
              hitSlop={8}
              onPress={() => goTo(index)}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
        <ImageButton
          testID="BackgroundSelect-choose"
          source={require('@assets/buttons/button_start_plate.png')}
          text={translate('backgroundSelect.choose')}
          textStyle={styles.chooseText}
          style={styles.chooseButton}
          onPress={choose}
        />
      </SafeAreaView>
    </View>
  );
};

export default BackgroundSelect;
