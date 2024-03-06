import {Canvas} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useCallback, useMemo, useState} from 'react';
import {grey, green, red} from 'material-colors';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import LineComponent from './components/LineComponent';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const screenDimension = Dimensions.get('screen');

export default () => {
  const offset = useSharedValue({x: 0, y: 0});
  //   const scale = useSharedValue(1);
  //   const savedScale = useSharedValue(1);
  const start = useSharedValue({x: 0, y: 0});
  //   const focal = useSharedValue({x: 0, y: 0});

  const [lines, setLines] = useState<
    {x1: number; y1: number; x2?: number; y2?: number}[]
  >([]);

  const addPoint = useCallback(() => {
    setLines(p => {
      const sizeX = -offset.value.x + screenDimension.width / 2;
      const sizeY = -offset.value.y + screenDimension.height / 2;
      const result = p.map((g, i) => {
        if (i + 1 === p.length && (!g.x2 || !g.y2)) {
          return {...g, x2: sizeX, y2: sizeY};
        }
        return {...g};
      });
      return [...result, {x1: sizeX, y1: sizeY}];
    });
  }, []);

  const lastLine = useMemo(
    () => (lines.length > 0 ? lines[lines.length - 1] : null),
    [lines],
  );

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(e => {
      offset.value = withTiming(
        {
          x: Math.round((e.translationX + start.value.x) / 10) * 10,
          y: Math.round((e.translationY + start.value.y) / 10) * 10,
        },
        {duration: 100},
      );
      start.value = withTiming(
        {
          x: Math.round((e.translationX + start.value.x) / 10) * 10,
          y: Math.round((e.translationY + start.value.y) / 10) * 10,
        },
        {duration: 100},
      );
      console.log(start.value);
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

  const gesture = Gesture.Simultaneous(panGesture);

  const dotStyles = useAnimatedStyle(() => {
    const dotSize = 1 * 7;
    return {
      position: 'absolute',
      zIndex: 100,
      top: screenDimension.height / 2 - dotSize / 2,
      left: screenDimension.width / 2 - dotSize / 2,
      backgroundColor: 'red',
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
    };
  });

  const [visible, setVisible] = useState(true);

  const stopLine = useCallback(() => {
    setLines(p => p.slice(0, -1));
  }, []);

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            width: screenDimension.width,
            height: screenDimension.height,
            backgroundColor: grey[200],
          }}>
          {lines.map((g, i) => (
            <>
              <LineComponent key={i} offset={offset} size={g} />
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
            ) : null}
          </View>
        </>
      ) : null}
    </>
  );
};
