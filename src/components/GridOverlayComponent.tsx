import React, {useMemo} from 'react';
import {CM_IN_PIXELS} from '../utils/config.ts';
import {Line} from '@shopify/react-native-skia';
import {grey} from 'material-colors';
import {SCREEN_DIMENSION} from '../utils/index.ts';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

const WightLineComponent = ({
  g,
  scale,
  side,
}: {
  g: number;
  scale: SharedValue<number>;
  side: string;
}) => {
  const p1 = useDerivedValue(
    () => ({
      x: SCREEN_DIMENSION.width / 2 + CM_IN_PIXELS * scale.value * g,
      y: 0,
    }),
    [scale],
  );
  const p2 = useDerivedValue(
    () => ({
      x: SCREEN_DIMENSION.width / 2 + CM_IN_PIXELS * scale.value * g,
      y: SCREEN_DIMENSION.height,
    }),
    [scale],
  );

  return (
    <Line
      key={'vertical-lines-' + side + '-' + g}
      color={grey[300]}
      style="stroke"
      strokeWidth={1}
      p1={p1}
      p2={p2}
    />
  );
};

const HeightLineComponent = ({
  g,
  scale,
  side,
}: {
  g: number;
  scale: SharedValue<number>;
  side: string;
}) => {
  const p1 = useDerivedValue(
    () => ({
      y: SCREEN_DIMENSION.height / 2 + CM_IN_PIXELS * scale.value * g,
      x: 0,
    }),
    [scale],
  );
  const p2 = useDerivedValue(
    () => ({
      y: SCREEN_DIMENSION.height / 2 + CM_IN_PIXELS * scale.value * g,
      x: SCREEN_DIMENSION.width,
    }),
    [scale],
  );

  return (
    <Line
      key={'horizontal-lines-' + side + '-' + g}
      color={grey[300]}
      style="stroke"
      strokeWidth={1}
      p1={p1}
      p2={p2}
    />
  );
};

function VerticalLinesComponent({scale}: {scale: SharedValue<number>}) {
  return (
    <>
      {Array.from(
        Array(Math.floor(SCREEN_DIMENSION.width / CM_IN_PIXELS) * 10),
      ).map((_, g) => (
        <WightLineComponent side={'left'} key={g} g={g + 1} scale={scale} />
      ))}
      <WightLineComponent side={'center'} g={0} scale={scale} />
      {Array.from(
        Array(Math.floor(SCREEN_DIMENSION.width / CM_IN_PIXELS) * 10),
      ).map((_, g) => (
        <WightLineComponent side={'right'} key={g} g={-(g + 1)} scale={scale} />
      ))}
    </>
  );
}

function HorizontalLinesComponent({scale}: {scale: SharedValue<number>}) {
  return (
    <>
      {Array.from(
        Array(Math.floor(SCREEN_DIMENSION.height / CM_IN_PIXELS) * 10),
      ).map((_, g) => (
        <HeightLineComponent side={'top'} key={g} g={g + 1} scale={scale} />
      ))}
      <HeightLineComponent side={'center'} g={0} scale={scale} />
      {Array.from(
        Array(Math.floor(SCREEN_DIMENSION.height / CM_IN_PIXELS) * 10),
      ).map((_, g) => (
        <HeightLineComponent
          side={'bottom'}
          key={g}
          g={-(g + 1)}
          scale={scale}
        />
      ))}
    </>
  );
}

export const GridOverlayComponent = ({scale}: {scale: SharedValue<number>}) => {
  const content = useMemo(() => {
    return (
      <>
        <VerticalLinesComponent scale={scale} />
        <HorizontalLinesComponent scale={scale} />
      </>
    );
  }, [scale]);

  return content;
};
