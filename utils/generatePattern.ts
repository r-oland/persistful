import { random } from './random';

const shapes: PatternEntity['shape'][] = ['circle', 'triangle'];

export const generatePattern = () => {
  const amountOfItems = random(3, 4);

  const patterns = Array.from(Array(amountOfItems).keys()).map(() => {
    const shape = random(0, 1);
    const size = random(20, 45);
    const r = random(0, 360);

    const x = [
      { left: `${random(-15, 30)}%` },
      { right: `${random(-15, 50)}%` },
    ];
    const y = [
      { top: `${random(-15, 20)}%` },
      { bottom: `${random(-15, 20)}%` },
    ];

    const pattern: PatternEntity = {
      shape: shapes[shape],
      size,
      r,
      ...x[random(0, 1)],
      ...y[random(0, 1)],
    };

    return pattern;
  });

  return patterns;
};
