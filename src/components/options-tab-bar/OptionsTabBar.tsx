import React, { useState } from 'react';

import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { Colors } from '@styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';

import {
  TAB_BAR_MIN_BOTTOM_PADDING,
  TAB_FILL,
  TAB_HEIGHT,
  TAB_STROKE_WIDTH,
  TAB_TIP_WIDTH,
} from './OptionsTabBar.constants';
import { styles } from './OptionsTabBar.styles';
import type { IOptionsTab } from './OptionsTabBar.types';

const tabPoints = (width: number) => {
  const inset = TAB_STROKE_WIDTH / 2;
  const middle = TAB_HEIGHT / 2;
  const bottom = TAB_HEIGHT - inset;

  return [
    `${TAB_TIP_WIDTH},${inset}`,
    `${width - TAB_TIP_WIDTH},${inset}`,
    `${width - inset},${middle}`,
    `${width - TAB_TIP_WIDTH},${bottom}`,
    `${TAB_TIP_WIDTH},${bottom}`,
    `${inset},${middle}`,
  ].join(' ');
};

const OptionsTab = ({ label, isFocused, onPress, testID }: IOptionsTab) => {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPress={onPress}
      onLayout={handleLayout}
      style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
    >
      {width > 0 ? (
        <Svg style={StyleSheet.absoluteFill} width={width} height={TAB_HEIGHT}>
          <Polygon
            points={tabPoints(width)}
            fill={isFocused ? TAB_FILL.active : TAB_FILL.inactive}
            stroke={isFocused ? Colors.neonCyan : Colors.neonMagenta}
            strokeWidth={TAB_STROKE_WIDTH}
          />
        </Svg>
      ) : null}
      <Text style={[styles.label, isFocused && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
};

const OptionsTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, TAB_BAR_MIN_BOTTOM_PADDING),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <OptionsTab
            key={route.key}
            testID={`OptionsTabBar-${route.name}`}
            label={label}
            isFocused={isFocused}
            onPress={handlePress}
          />
        );
      })}
    </View>
  );
};

export default OptionsTabBar;
