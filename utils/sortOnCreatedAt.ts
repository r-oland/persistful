export const sortOnCreatedAt = <T extends { createdAt: Date }>(
  arr: T[],
  dir: 'asc' | 'desc'
): T[] =>
  arr.sort(
    (a, b) =>
      new Date(dir === 'desc' ? b.createdAt : a.createdAt).getTime() -
      new Date(dir === 'desc' ? a.createdAt : b.createdAt).getTime()
  );
