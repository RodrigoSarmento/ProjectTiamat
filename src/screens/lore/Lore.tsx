import { useState } from 'react';

import { ImageBackground, ScrollView, Text, View } from 'react-native';

import { CloseIcon } from '@components/close-icon';
import { Collapsible } from '@components/collapsible';
import { TagButton } from '@components/tag-button';
import { translate } from '@helper/translate';
import { markLoreRead } from '@redux/slices/SavesSlice';
import type { RootState } from '@redux/store';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  CHARACTER_ENTRIES,
  LORE_ENTRIES,
  LORE_TAB_FILL,
  LORE_TAB_FILL_SELECTED,
  LORE_TAB_IDLE,
  LORE_TAB_SELECTED,
  loreReadId,
} from './Lore.constants';
import { styles } from './Lore.styles';
import type { LoreTab } from './Lore.types';

const Lore = () => {
  const [tab, setTab] = useState<LoreTab>('history');
  const dispatch = useDispatch();
  const readLoreIds = useSelector(
    (state: RootState) => state.saves.readLoreIds,
  );
  const markRead = (id: string) => dispatch(markLoreRead(id));

  return (
    <ImageBackground
      style={CommonStyles.flex1}
      source={require('@assets/backgrounds/home_cyberpunk.png')}
    >
      <SafeAreaView style={CommonStyles.flex1} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <View style={CommonStyles.settingsHeader}>
            <Text style={CommonStyles.settingsTitle}>
              {translate('words.lore')}
            </Text>
            <CloseIcon />
          </View>
          <View style={styles.actions}>
            <TagButton
              testID="Lore-history"
              label={translate('words.history')}
              accent={tab === 'history' ? LORE_TAB_SELECTED : LORE_TAB_IDLE}
              fill={tab === 'history' ? LORE_TAB_FILL_SELECTED : LORE_TAB_FILL}
              onPress={() => setTab('history')}
            />
            <TagButton
              testID="Lore-characters"
              label={translate('words.characters')}
              accent={tab === 'characters' ? LORE_TAB_SELECTED : LORE_TAB_IDLE}
              fill={
                tab === 'characters' ? LORE_TAB_FILL_SELECTED : LORE_TAB_FILL
              }
              onPress={() => setTab('characters')}
            />
          </View>
          <View style={CommonStyles.settingsDivider} />
          <ScrollView key={tab} contentContainerStyle={styles.list}>
            {tab === 'history'
              ? LORE_ENTRIES.map((id) => {
                  const readId = loreReadId('history', id);

                  return (
                    <Collapsible
                      key={id}
                      testID={`Lore-${id}`}
                      title={translate(`lore.${id}.title`)}
                      description={translate(`lore.${id}.description`)}
                      isNew={!readLoreIds.includes(readId)}
                      onPress={() => markRead(readId)}
                    />
                  );
                })
              : CHARACTER_ENTRIES.map((entry) => {
                  const readId = loreReadId('characters', entry.id);

                  return (
                    <Collapsible
                      key={entry.id}
                      testID={`Lore-${entry.id}`}
                      title={translate(`characters.${entry.id}`)}
                      description={translate(`lore.characters.${entry.id}`)}
                      portrait={entry.portrait}
                      isNew={!readLoreIds.includes(readId)}
                      onPress={() => markRead(readId)}
                    />
                  );
                })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Lore;
