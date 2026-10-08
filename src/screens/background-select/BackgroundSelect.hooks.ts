import { useRef, useState } from 'react';

import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { startGame } from '@redux/slices/SavesSlice';
import { Common } from '@styles';
import { useDispatch } from 'react-redux';

import { BACKGROUNDS } from './BackgroundSelect.constants';
import type { IBackgroundOption } from './BackgroundSelect.types';

export const useBackgroundSelect = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<
      StackNavigationProp<GameStackParamsList, 'BackgroundSelect'>
    >();
  const listRef = useRef<FlatList<IBackgroundOption>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getItemLayout = (_: unknown, index: number) => ({
    length: Common.screenWidth,
    offset: Common.screenWidth * index,
    index,
  });

  const onMomentumScrollEnd = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(nativeEvent.contentOffset.x / Common.screenWidth);
    setActiveIndex(Math.min(BACKGROUNDS.length - 1, Math.max(0, page)));
  };

  const goTo = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const choose = () => {
    dispatch(startGame(BACKGROUNDS[activeIndex].id));
    navigation.reset({ index: 0, routes: [{ name: 'Game' }] });
  };

  return {
    listRef,
    activeIndex,
    getItemLayout,
    onMomentumScrollEnd,
    goTo,
    choose,
  };
};
