import {Canvas, Circle, Line} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {CM_IN_PIXELS, projectSize} from './utils/config';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {GridOverlayComponent} from './components/GridOverlayComponent';
import {grey, green, red} from 'material-colors';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

const screenDimension = Dimensions.get('screen');

export default () => {
  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const width = projectSize[0] * 100 * CM_IN_PIXELS;
  const height = projectSize[1] * 100 * CM_IN_PIXELS;

  const [lines, setLines] = useState<
    {x1: number; y1: number; x2?: number; y2?: number}[]
  >([]);

  const addPoint = useCallback((x: number, y: number) => {
    setLines(p => {
      const copy = [...p];
      if (
        copy.length > 0 &&
        (!copy[copy.length - 1].x2 || !copy[copy.length - 1].y2)
      ) {
        copy[copy.length - 1]['x2'] = x;
        copy[copy.length - 1]['y2'] = y;
      }
      copy.push({x1: x, y1: y});
      return copy;
    });
  }, []);

  const lastLine = useMemo(
    () => (lines.length > 0 ? lines[lines.length - 1] : null),
    [lines],
  );

  const dotStyles = useAnimatedStyle(() => {
    const dotSize = scale.value * 5;
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

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: scale.value},
      ],
    };
  });

  const start = useSharedValue({x: 0, y: 0});

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      const x = Math.round(-(offset.value.x / scale.value - width / 2) / 10);
      const y = Math.round(-(offset.value.y / scale.value - height / 2) / 10);
      const dotSizeWidth = scale.value * (width / 2);
      const dotSizeHeight = scale.value * (height / 2);
      offset.value = withTiming(
        {
          x: dotSizeWidth - 10 * x * scale.value,
          y: dotSizeHeight - 10 * y * scale.value,
        },
        {
          duration: 100,
        },
      );
      start.value = withTiming(
        {
          x: dotSizeWidth - 10 * x * scale.value,
          y: dotSizeHeight - 10 * y * scale.value,
        },
        {
          duration: 100,
        },
      );
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      const result = savedScale.value * e.scale;
      scale.value = result > 3 ? 3 : result;
      scale.value = scale.value < 1 ? 1 : scale.value;
    })
    .onEnd(e => {
      savedScale.value = scale.value > 3 ? 3 : scale.value;
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[animatedStyles, {padding: 40, backgroundColor: grey[50]}]}>
          <Canvas style={{width, height, backgroundColor: grey[200]}}>
            {/* {visible ? <GridOverlayComponent /> : null} */}
            {lines.map(g => (
              <>
                <Line
                  color={green[200]}
                  style="stroke"
                  strokeWidth={4}
                  p1={{x: g.x1, y: g.y1}}
                  p2={{x: g.x2 || position.x, y: g.y2 || position.y}}
                />
                <Circle r={4} cx={g.x1} cy={g.y1} color={green[600]} />
                {g.x2 && g.y2 ? (
                  <Circle r={4} cx={g.x2} cy={g.y2} color={green[600]} />
                ) : null}
              </>
            ))}
          </Canvas>
        </Animated.View>
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
              onPress={() => addPoint(offset.value.x, offset.value.y)}>
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
    </View>
  );
};
