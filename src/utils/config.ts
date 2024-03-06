export const projectSize = [5, 5];

export const CM_IN_PIXELS = 10;

export function interpolateValues(number: number) {
  const value1 = {x: -100, y: 130};
  const value2 = {x: -403, y: -173};

  const deltaX = value2.x - value1.x;
  const deltaY = value2.y - value1.y;

  const interpolatedX = value1.x + (number - 1) * (deltaX / (2 - 1));
  const interpolatedY = value1.y + (number - 1) * (deltaY / (2 - 1));

  return {x: interpolatedX, y: interpolatedY};
}
