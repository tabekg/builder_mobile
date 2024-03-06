import React, {useMemo} from 'react';
import {CM_IN_PIXELS, projectSize} from '../utils/config.ts';
import {Line, useImage} from '@shopify/react-native-skia';
import {grey} from 'material-colors';

export const GridOverlayComponent = () => {
  const width = projectSize[0] / 5;
  const height = projectSize[1] / 5;

  const gridOverlay = useImage(require('../assets/grid-overlay.png'));

  const content = useMemo(() => {
    // return (
    //   <VirtualizedList
    //     renderItem={({index}) => (
    //       <Image
    //         key={index}
    //         image={gridOverlay}
    //         width={500}
    //         height={500}
    //         x={index * 500}
    //         y={index * 500}
    //       />
    //     )}
    //     keyExtractor={(_, index) => index.toString()}
    //     getItemCount={() => width * height}
    //     getItem={(_, i) => i}
    //   />
    // );

    return (
      <>
        {Array.from(Array(width * 5 * 100 * CM_IN_PIXELS + 1)).map((_, g) => (
          <Line
            color={grey[400]}
            style="stroke"
            strokeWidth={1}
            p1={{x: 0, y: g * CM_IN_PIXELS}}
            p2={{x: width * 5 * 100 * CM_IN_PIXELS, y: g * CM_IN_PIXELS}}
          />
        ))}
        {Array.from(Array(height * 5 * 100 * CM_IN_PIXELS + 1)).map((_, g) => (
          <Line
            color={grey[400]}
            style="stroke"
            strokeWidth={1}
            p1={{x: g * CM_IN_PIXELS, y: 0}}
            p2={{x: g * CM_IN_PIXELS, y: height * 5 * 100 * CM_IN_PIXELS}}
          />
        ))}
      </>
    );

    // return (
    //   <>
    //     {Array.from(Array(width)).map((_, g) => (
    //       <Fragment key={g}>
    //         {Array.from(Array(height)).map((_, j) => (
    //           <Image
    //             key={g + '-' + j}
    //             image={gridOverlay}
    //             width={500}
    //             height={500}
    //             x={g * 500}
    //             y={j * 500}
    //           />
    //         ))}
    //       </Fragment>
    //     ))}
    //   </>
    // );
  }, [gridOverlay]);

  return content;
};
