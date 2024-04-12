import {Canvas} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {grey, green, red} from 'material-colors';
import {Text, TouchableOpacity, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {GridOverlayComponent} from '../components/GridOverlayComponent';
import {CM_IN_PIXELS, DOT_SIZE} from '../utils/config';
import {SCREEN_DIMENSION} from '../utils';
import LineComponent from '../components/LineComponent';

export default () => {
  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const start = useSharedValue({x: 0, y: 0});
  //   const focal = useSharedValue({x: 0, y: 0});

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
      if (scale.value < 0.1) {
        scale.value = 0.1;
      }
      if (scale.value > 1) {
        scale.value = 1;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const cmInPixels = useDerivedValue(() => CM_IN_PIXELS * scale.value, [scale]);

  const [lines, setLines] = useState<
    {x1: number; y1: number; x2?: number; y2?: number}[]
  >([]);

  const addPoint = useCallback(() => {
    const sizeX =
      -offset.value.x +
      Math.floor(SCREEN_DIMENSION.width / 2 / cmInPixels.value);
    const sizeY =
      -offset.value.y +
      Math.floor(SCREEN_DIMENSION.height / 2 / cmInPixels.value);

    setLines(w => {
      const p = [...w];
      const lastItem = p[p.length - 1];
      if (lastItem && (!lastItem.x2 || !lastItem.y2)) {
        p[p.length - 1] = {...p[p.length - 1], x2: sizeX, y2: sizeY};
      }
      p.push({x1: sizeX, y1: sizeY});
      return p;
    });
  }, [offset, cmInPixels]);

  const lastLine = useMemo(
    () => (lines.length > 0 ? lines[lines.length - 1] : null),
    [lines],
  );

  const dotSize = useDerivedValue(() => DOT_SIZE * scale.value, [scale]);

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      const size = {
        x: e.translationX / cmInPixels.value + start.value.x,
        y: e.translationY / cmInPixels.value + start.value.y,
      };
      offset.value = size;
    })
    .onEnd(e => {
      const size = {
        x:
          Math.round(e.translationX / cmInPixels.value) +
          Math.round(start.value.x),
        y:
          Math.round(e.translationY / cmInPixels.value) +
          Math.round(start.value.y),
      };

      offset.value = withTiming(size, {duration: 100});
      start.value = withTiming(size, {duration: 100});
    });

  //   const pinchGesture = Gesture.Pinch()
  //     .onUpdate(e => {
  //       const result = savedScale.value * e.scale;
  //       scale.value = result > 3 ? 3 : result;
  //       scale.value = scale.value < 1 ? 1 : scale.value;
  //       focal.value = {x: e.focalX, y: e.focalY};
  //     })
  //     .onEnd(e => {
  //       savedScale.value = scale.value > 3 ? 3 : scale.value;
  //       offset.value = {
  //         x: start.value.x - e.scale * 10,
  //         y: start.value.y - e.scale * 10,
  //       };
  //       start.value = {
  //         x: offset.value.x,
  //         y: offset.value.y,
  //       };
  //     });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const dotStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: 100,
      top: SCREEN_DIMENSION.height / 2 - dotSize.value / 2,
      left: SCREEN_DIMENSION.width / 2 - dotSize.value / 2,
      backgroundColor: 'red',
      width: dotSize.value,
      height: dotSize.value,
      // opacity: dotSize.value < DOT_SIZE / 2 ? 0 : 1,
      borderRadius: dotSize.value / 2,
    };
  }, [scale, dotSize]);

  const [visible, setVisible] = useState(true);

  const stopLine = useCallback(() => {
    setLines(p => p.slice(0, -1));
  }, []);

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            width: SCREEN_DIMENSION.width,
            height: SCREEN_DIMENSION.height,
            backgroundColor: grey[200],
          }}>
          <GridOverlayComponent scale={scale} />
          {lines.map((g, i) => (
            <>
              <LineComponent scale={scale} key={i} offset={offset} size={g} />
            </>
          ))}
        </Canvas>
      </GestureDetector>

      {visible ? (
        <>
          <Animated.View style={dotStyles} />
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              bottom: 20,
              left: 10,
              right: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: green[500],
                padding: 20,
                alignItems: 'center',
                borderRadius: 20,
              }}
              onPress={() => addPoint()}>
              <Text style={{color: 'white', fontSize: 15}}>Добавить точку</Text>
            </TouchableOpacity>
            {lastLine && (!lastLine.x2 || !lastLine.y2) ? (
              <TouchableOpacity
                style={{
                  backgroundColor: red[500],
                  padding: 20,
                  alignItems: 'center',
                  borderRadius: 20,
                }}
                onPress={() => stopLine()}>
                <Text style={{color: 'white', fontSize: 15}}>Стоп</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: red[500],
                  padding: 20,
                  alignItems: 'center',
                  borderRadius: 20,
                }}
                onPress={() => {
                  setLines([]);
                  offset.value = {x: 0, y: 0};
                }}>
                <Text style={{color: 'white', fontSize: 15}}>Зачистить</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : null}
    </>
  );
};
