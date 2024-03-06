import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {grey, green, red} from 'material-colors';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {projectSize} from './src/utils/config.ts';
import {Canvas, Circle, Line} from '@shopify/react-native-skia';
import {GridOverlayComponent} from './src/components/GridOverlayComponent.tsx';

const screenDimension = Dimensions.get('screen');

function SvgExample() {
  const [zoomLevel, setZoomLevel] = useState(2);
  const zoomLevelRef = useRef(2);
  const zoomableRef = useRef<ReactNativeZoomableView>();

  const width = projectSize[0] * 100;
  const height = projectSize[1] * 100;

  const dotSize = useMemo(() => {
    return zoomLevel * 0.6666666666666666;
  }, [zoomLevel]);

  const [position, setPosition] = useState({x: 0, y: 0});

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

  const stopLine = useCallback(() => {
    setLines(p => p.slice(0, -1));
  }, []);

  const visible = useMemo(() => {
    return !(
      position.x < 0 ||
      position.y < 0 ||
      position.x > height ||
      position.y > width ||
      zoomLevel < 5
    );
  }, [position, zoomLevel]);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
      <>
        {visible ? (
          <>
            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                top: screenDimension.height / 2 - dotSize / 2,
                left: screenDimension.width / 2 - dotSize / 2,
                backgroundColor: 'red',
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
              }}
            />
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
                onPress={() => addPoint(position.x, position.y)}>
                <Text style={{color: 'white', fontSize: 15}}>
                  Добавить точку
                </Text>
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

        <ReactNativeZoomableView
          ref={zoomableRef}
          doubleTapZoomToCenter={true}
          bindToBorders={false}
          onTransform={z => {
            setPosition({
              x: -(z.offsetX - height / 2),
              y: -(z.offsetY - width / 2),
            });
          }}
          onPanResponderEnd={(a, b, z) => {
            // zoomableRef.current?.moveTo(-100, 130); // 1
            // zoomableRef.current?.moveTo(-403, -173); // 2
            // return;
            // zoomableRef.current?.moveTo(-550, -320); // 1.5
            // zoomableRef.current?.moveTo(-800, -570); // 2
            // zoomableRef.current?.moveTo(-1300, -1070); // 3
            // zoomableRef.current?.moveTo(
            //   -(300 + zoom * 500),
            //   -(70 + zoom * 500),
            // );
            // const size = {
            //   x: Math.round(-(z.offsetX - height / 2) / 10),
            //   y: Math.round(-(z.offsetY - width / 2) / 10),
            // };
            // if (size.x < 0) {
            //   size.x = 0;
            // }
            // if (size.y < 0) {
            //   size.y = 0;
            // }
            // if (size.x > width / 10) {
            //   size.x = width / 10 - 1;
            // }
            // if (size.y > height / 10) {
            //   size.y = height / 10 - 1;
            // }
            // const val = interpolateValues(z.zoomLevel);
            // zoomableRef.current?.moveTo(
            //   val.x + 10 * size.x * z.zoomLevel,
            //   val.y + 10 * size.y * z.zoomLevel,
            // );
          }}
          onZoomAfter={(_, __, object) => {
            const level = Math.round(object.zoomLevel * 10);
            if (zoomLevelRef.current !== level) {
              setZoomLevel(level);
              zoomLevelRef.current = level;
            }
          }}
          maxZoom={3}
          minZoom={0.2}
          zoomStep={1}
          initialZoom={0.2}>
          <Canvas style={{width, height, backgroundColor: grey[500]}}>
            {visible ? <GridOverlayComponent /> : null}
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
        </ReactNativeZoomableView>
      </>
    </GestureHandlerRootView>
  );
}

export default SvgExample;
