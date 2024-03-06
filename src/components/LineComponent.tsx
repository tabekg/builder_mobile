import {Circle, Group, Line} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {green} from 'material-colors';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import React from 'react';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export default ({
  size,
  offset,
}: {
  size: {x1: number; y1: number; x2?: number; y2?: number};
  offset: SharedValue<{x: number; y: number}>;
}) => {
  const p1 = useDerivedValue(() => ({
    x: size.x1 + offset.value.x,
    y: size.y1 + offset.value.y,
  }));

  const p2 = useDerivedValue(() => ({
    x: size.x2 ? size.x2 + offset.value.x : width / 2,
    y: size.y2 ? size.y2 + offset.value.y : height / 2,
  }));

  const cx1 = useDerivedValue(() => size.x1 + offset.value.x);
  const cy1 = useDerivedValue(() => size.y1 + offset.value.y);
  const cx2 = useDerivedValue(() =>
    size.x2 ? offset.value.x + size.x2 : width / 2,
  );
  const cy2 = useDerivedValue(() =>
    size.y2 ? offset.value.y + size.y2 : height / 2,
  );
  const r = useDerivedValue(() => 4);

  return (
    <>
      <Line color={green[200]} style="stroke" strokeWidth={r} p1={p1} p2={p2} />
      <Circle r={r} cx={cx1} cy={cy1} color={green[600]} />
      {size.x2 && size.y2 ? (
        <Circle r={r} cx={cx2} cy={cy2} color={green[600]} />
      ) : null}
    </>
  );
};
