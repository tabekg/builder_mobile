import {Circle, Line, useFont} from '@shopify/react-native-skia';
import {green} from 'material-colors';
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import React, {useState} from 'react';
import {CM_IN_PIXELS, DOT_SIZE} from '../utils/config';
import ResponsiveText from 'react-native-skia-responsive-text';
import {SCREEN_DIMENSION, calculateDistance} from '../utils';

export default ({
  size,
  offset,
  scale,
}: {
  size: {x1: number; y1: number; x2?: number; y2?: number};
  offset: SharedValue<{x: number; y: number}>;
  scale: SharedValue<number>;
}) => {
  const [distance, setDistance] = useState('');

  const font = useFont(require('../assets/Roboto/Roboto-Regular.ttf'), 14);

  const cmInPixels = useDerivedValue(() => CM_IN_PIXELS * scale.value, [scale]);
  const dotSize = useDerivedValue(() => DOT_SIZE * scale.value, [scale]);

  const centerInPixelsWidth = useDerivedValue(
    () =>
      cmInPixels.value / 2 +
      Math.round(SCREEN_DIMENSION.width / 2 / cmInPixels.value) *
        cmInPixels.value,
    [cmInPixels],
  );
  const centerInPixelsHeight = useDerivedValue(
    () =>
      cmInPixels.value / 2 +
      Math.round(SCREEN_DIMENSION.height / 2 / cmInPixels.value) *
        cmInPixels.value,
    [cmInPixels],
  );

  const remainingHeightPixels = useDerivedValue(
    () =>
      SCREEN_DIMENSION.height / 2 -
      Math.floor(SCREEN_DIMENSION.height / 2 / cmInPixels.value) *
        cmInPixels.value,
    [cmInPixels],
  );

  const remainingWidthPixels = useDerivedValue(
    () =>
      SCREEN_DIMENSION.width / 2 -
      Math.floor(SCREEN_DIMENSION.width / 2 / cmInPixels.value) *
        cmInPixels.value,
    [cmInPixels],
  );

  const p1 = useDerivedValue(
    () => ({
      x:
        (offset.value.x + size.x1) * cmInPixels.value +
        remainingWidthPixels.value,
      y:
        (offset.value.y + size.y1) * cmInPixels.value +
        remainingHeightPixels.value,
    }),
    [size, offset, remainingHeightPixels, cmInPixels],
  );

  const p2 = useDerivedValue(
    () => ({
      x: size.x2
        ? (offset.value.x + size.x2) * cmInPixels.value +
          remainingWidthPixels.value
        : SCREEN_DIMENSION.width / 2,
      y: size.y2
        ? (offset.value.y + size.y2) * cmInPixels.value +
          remainingHeightPixels.value
        : SCREEN_DIMENSION.height / 2,
    }),
    [size, offset, remainingHeightPixels, cmInPixels],
  );

  const cx1 = useDerivedValue(
    () =>
      (size.x1 + offset.value.x) * cmInPixels.value +
      remainingWidthPixels.value,
    [size, offset, remainingWidthPixels],
  );
  const cy1 = useDerivedValue(
    () =>
      (size.y1 + offset.value.y) * cmInPixels.value +
      remainingHeightPixels.value,
    [size, offset, remainingHeightPixels],
  );
  const cx2 = useDerivedValue(
    () =>
      size.x2
        ? (offset.value.x + size.x2) * cmInPixels.value +
          remainingWidthPixels.value
        : SCREEN_DIMENSION.width / 2,
    [size, offset, remainingWidthPixels],
  );
  const cy2 = useDerivedValue(
    () =>
      size.y2
        ? (offset.value.y + size.y2) * cmInPixels.value +
          remainingHeightPixels.value
        : SCREEN_DIMENSION.height / 2,
    [size, offset, remainingHeightPixels],
  );
  const r = useDerivedValue(() => (DOT_SIZE / 2) * scale.value, [scale]);

  const textX = useDerivedValue(() => {
    if (!size.x2) {
      return centerInPixelsWidth.value;
    }
    const diff =
      (size.x2
        ? (offset.value.x + size.x2) * cmInPixels.value
        : centerInPixelsWidth.value) -
      (size.x1 + offset.value.x) * cmInPixels.value;
    return (size.x1 + offset.value.x) * cmInPixels.value + diff / 2 - 15;
  }, [centerInPixelsWidth, size, cmInPixels]);

  const textY = useDerivedValue(() => {
    if (!size.y2) {
      return centerInPixelsHeight.value;
    }
    const diff =
      (size.y2
        ? (offset.value.y + size.y2) * cmInPixels.value
        : centerInPixelsHeight.value) -
      (size.y1 + offset.value.y) * cmInPixels.value;
    return (size.y1 + offset.value.y) * cmInPixels.value + diff / 2 - 15;
  }, [centerInPixelsHeight, size, cmInPixels]);

  const distanceRef = useDerivedValue(() => {
    return (
      calculateDistance(
        cx1.value / cmInPixels.value,
        cy1.value / cmInPixels.value,
        cx2.value / cmInPixels.value,
        cy2.value / cmInPixels.value,
      ) * 5
    ).toFixed();
  }, [cmInPixels, cx1, cy1, cx2, cy2]);

  useAnimatedReaction(
    () => distanceRef.value,
    () => {
      runOnJS(setDistance)(distanceRef.value);
    },
  );

  return (
    <>
      <Line color={green[200]} style="stroke" strokeWidth={r} p1={p1} p2={p2} />
      <Circle r={r} cx={cx1} cy={cy1} color={green[600]} />
      {size.x2 && size.y2 ? (
        <Circle r={r} cx={cx2} cy={cy2} color={green[600]} />
      ) : null}
      {font ? (
        <ResponsiveText
          width={30}
          x={textX}
          y={textY}
          text={distance}
          font={font}
        />
      ) : null}
    </>
  );
};
