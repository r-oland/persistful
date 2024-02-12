import { random } from 'utils/random';

const shapes: PatternEntity['shape'][] = ['circle', 'triangle'];

const initShape = () => {
  const shape = shapes[random(0, 1)];
  const size = random(20, 40);
  const r = random(0, 360);

  return {
    shape,
    size,
    r,
  };
};

const getRandomPosition = () => `${random(-10, 10)}%`;

export function generateRewardShapes(): PatternEntity[] {
  return [
    // Right top
    {
      ...initShape(),
      top: getRandomPosition(),
      right: getRandomPosition(),
    },
    // Right bottom
    {
      ...initShape(),
      bottom: getRandomPosition(),
      right: getRandomPosition(),
    },
    // Left top
    {
      ...initShape(),
      top: getRandomPosition(),
      left: getRandomPosition(),
    },
    // Left bottom
    {
      ...initShape(),
      bottom: getRandomPosition(),
      left: getRandomPosition(),
    },
  ];
}
