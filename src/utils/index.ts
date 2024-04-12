import {Dimensions} from 'react-native';
import {CM_IN_PIXELS} from './config';

export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  'worklet';
  const deltaX: number = x2 - x1;
  const deltaY: number = y2 - y1;
  const distance: number = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  return +Math.round(distance);
};

export const SCREEN_DIMENSION = Dimensions.get('screen');

export const SCREEN_IN_CM_WIDTH = Math.round(
  SCREEN_DIMENSION.width / CM_IN_PIXELS,
);
export const SCREEN_IN_CM_HEIGHT = Math.round(
  SCREEN_DIMENSION.height / CM_IN_PIXELS,
);

export const CENTER_IN_PIXCELS_WIDTH =
  Math.round(SCREEN_IN_CM_WIDTH / 2) * CM_IN_PIXELS - CM_IN_PIXELS / 2;

export const CENTER_IN_PIXCELS_HEIGHT =
  Math.round(SCREEN_IN_CM_HEIGHT / 2) * CM_IN_PIXELS - CM_IN_PIXELS / 2;
