import React, { useState } from 'react';

import {
  Image,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  Platform,
  View,
} from 'react-native';

import { styles } from './NineSliceImage.styles';
import type { INineSliceImage } from './NineSliceImage.types';

type SliceProps = {
  source: ImageSourcePropType;
  sourceSize: INineSliceImage['sourceSize'];
  srcX: number;
  srcY: number;
  srcW: number;
  srcH: number;
  destW: number;
  destH: number;
};

const Slice: React.FC<SliceProps> = ({
  source,
  sourceSize,
  srcX,
  srcY,
  srcW,
  srcH,
  destW,
  destH,
}) => {
  if (destW <= 0 || destH <= 0 || srcW <= 0 || srcH <= 0) {
    return null;
  }

  const scaleX = destW / srcW;
  const scaleY = destH / srcH;

  return (
    <View style={[styles.clip, { width: destW, height: destH }]}>
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: sourceSize.width * scaleX,
            height: sourceSize.height * scaleY,
            left: -srcX * scaleX,
            top: -srcY * scaleY,
          },
        ]}
      />
    </View>
  );
};

const NineSliceImage: React.FC<INineSliceImage> = ({
  source,
  capInsets,
  sourceSize,
  style,
  testID,
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width === layout.width && height === layout.height) {
      return;
    }
    setLayout({ width, height });
  };

  if (Platform.OS === 'ios') {
    return (
      <Image
        testID={testID}
        source={source}
        capInsets={capInsets}
        resizeMode="stretch"
        style={style}
      />
    );
  }

  const { top, left, bottom, right } = capInsets;
  const { width, height } = layout;
  const srcCenterW = sourceSize.width - left - right;
  const srcCenterH = sourceSize.height - top - bottom;
  const destCenterW = Math.max(0, width - left - right);
  const destCenterH = Math.max(0, height - top - bottom);

  return (
    <View
      testID={testID}
      pointerEvents="none"
      style={style}
      onLayout={onLayout}
    >
      {width > 0 && height > 0 ? (
        <>
          <View style={styles.row}>
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={0}
              srcY={0}
              srcW={left}
              srcH={top}
              destW={left}
              destH={top}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={left}
              srcY={0}
              srcW={srcCenterW}
              srcH={top}
              destW={destCenterW}
              destH={top}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={sourceSize.width - right}
              srcY={0}
              srcW={right}
              srcH={top}
              destW={right}
              destH={top}
            />
          </View>
          <View style={styles.row}>
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={0}
              srcY={top}
              srcW={left}
              srcH={srcCenterH}
              destW={left}
              destH={destCenterH}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={left}
              srcY={top}
              srcW={srcCenterW}
              srcH={srcCenterH}
              destW={destCenterW}
              destH={destCenterH}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={sourceSize.width - right}
              srcY={top}
              srcW={right}
              srcH={srcCenterH}
              destW={right}
              destH={destCenterH}
            />
          </View>
          <View style={styles.row}>
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={0}
              srcY={sourceSize.height - bottom}
              srcW={left}
              srcH={bottom}
              destW={left}
              destH={bottom}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={left}
              srcY={sourceSize.height - bottom}
              srcW={srcCenterW}
              srcH={bottom}
              destW={destCenterW}
              destH={bottom}
            />
            <Slice
              source={source}
              sourceSize={sourceSize}
              srcX={sourceSize.width - right}
              srcY={sourceSize.height - bottom}
              srcW={right}
              srcH={bottom}
              destW={right}
              destH={bottom}
            />
          </View>
        </>
      ) : null}
    </View>
  );
};

export default NineSliceImage;
