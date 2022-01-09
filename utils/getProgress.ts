export const getProgress = (streak: number) => {
  // 0 - 0.99
  if (streak < 1) return [streak * 100, 0, 0];

  // 1
  if (streak === 1) return [100, 0, 0];

  // 1.01 - 1.99
  if (streak > 1 && streak < 2) return [100, (streak - 1) * 100, 0];

  // 2
  if (streak === 2) return [100, 100, 0];

  // 2.01 - 2.99
  if (streak > 2 && streak < 3) return [100, 100, (streak - 2) * 100];

  // 3
  return [100, 100, 100];
};
