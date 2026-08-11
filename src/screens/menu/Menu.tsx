import { useState } from 'react';

import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import lore from '../../data/lore.json';

import styles from './Menu.styles';

type LoreCategory = keyof typeof lore;

const LORE_CATEGORIES = Object.keys(lore) as LoreCategory[];

const formatCategoryLabel = (category: LoreCategory) =>
  category.charAt(0).toUpperCase() + category.slice(1);

const Menu = () => {
  const [activeTab, setActiveTab] = useState<
    'game' | 'lore' | 'map' | 'status' | 'settings'
  >('lore');
  const [loreContentActive, setLoreContentActive] =
    useState<LoreCategory>('places');

  const navigation =
    useNavigation<StackNavigationProp<GameStackParamsList, 'Menu'>>();

  const renderContent = () => {
    if (activeTab === 'lore') {
      const entries = lore[loreContentActive];

      return (
        <View style={styles.loreContainer}>
          <View style={styles.loreSidebar}>
            <Image
              source={require('@assets/icons/left_top_divisor.png')}
              style={styles.leftTopDivisorIcon}
            />
            <View style={styles.loreContentList}>
              {LORE_CATEGORIES.map((category) => {
                const isActive = loreContentActive === category;

                return (
                  <Pressable
                    key={category}
                    style={
                      isActive
                        ? styles.loreContentButtonActive
                        : styles.loreContentButton
                    }
                    onPress={() => setLoreContentActive(category)}
                  >
                    {isActive && (
                      <Image
                        style={styles.activeMarker}
                        source={require('@assets/icons/select.png')}
                      />
                    )}
                    <Text style={styles.loreContentTitle}>
                      {formatCategoryLabel(category)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.loreContentSeparator} />
          <ScrollView style={styles.loreContent}>
            {entries.map((entry, index) => (
              <View key={`${loreContentActive}-${entry.name}-${index}`}>
                <View style={styles.titleContainer}>
                  <Image
                    style={styles.topicIcon}
                    source={require('@assets/icons/topic.png')}
                  />
                  <Text style={styles.loreTitle}>{entry.name}</Text>
                </View>

                <Text style={styles.loreDescription}>{entry.description}</Text>
                {index < entries.length - 1 ? (
                  <Image
                    source={require('@assets/icons/horizontal_divisor.png')}
                    style={styles.divider}
                  />
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
  };

  return (
    <ImageBackground
      source={require('@assets/backgrounds/menu.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.tabsContainer}>
          <ImageButton
            source={
              activeTab === 'game'
                ? require('@assets/buttons/tabs/tab_game_focused.png')
                : require('@assets/buttons/tabs/tab_game_unfocused.png')
            }
            containerStyle={styles.tabButtonContainer}
            style={styles.tabButton}
            resizeMode="contain"
            onPress={() => navigation.navigate('Game')}
          />
          <ImageButton
            source={
              activeTab === 'lore'
                ? require('@assets/buttons/tabs/tab_lore_focused.png')
                : require('@assets/buttons/tabs/tab_lore_unfocused.png')
            }
            containerStyle={styles.tabButtonContainer}
            style={styles.tabButton}
            resizeMode="contain"
            onPress={() => setActiveTab('lore')}
          />
          <ImageButton
            source={
              activeTab === 'status'
                ? require('@assets/buttons/tabs/tab_status_focused.png')
                : require('@assets/buttons/tabs/tab_status_unfocused.png')
            }
            containerStyle={styles.tabButtonContainer}
            style={styles.tabButton}
            resizeMode="contain"
            onPress={() => setActiveTab('status')}
          />
          <ImageButton
            source={
              activeTab === 'settings'
                ? require('@assets/buttons/tabs/tab_settings_focused.png')
                : require('@assets/buttons/tabs/tab_settings_unfocused.png')
            }
            containerStyle={styles.tabButtonContainer}
            style={styles.tabButton}
            resizeMode="contain"
            onPress={() => setActiveTab('settings')}
          />
        </View>
        {renderContent()}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Menu;
