export const projectSize = [5, 5];

export const CM_IN_PIXELS = 20;
export const DOT_SIZE = 12;

export function interpolateValues(number: number) {
  const value1 = {x: -100, y: 130};
  const value2 = {x: -403, y: -173};

  const deltaX = value2.x - value1.x;
  const deltaY = value2.y - value1.y;

  const interpolatedX = value1.x + (number - 1) * (deltaX / (2 - 1));
  const interpolatedY = value1.y + (number - 1) * (deltaY / (2 - 1));

  return {x: interpolatedX, y: interpolatedY};
}

export function calculateRotationAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const delta_x: number = x2 - x1;
  const delta_y: number = y2 - y1;
  const angle_rad: number = Math.atan2(delta_y, delta_x);
  const angle_deg: number = angle_rad * (180 / Math.PI);
  return angle_deg;
}
