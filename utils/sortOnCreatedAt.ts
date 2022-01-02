export const sortOnCreatedAt = (arr: any[], dir: 'asc' | 'desc') =>
  arr.sort(
    (a, b) =>
      new Date(dir === 'desc' ? b.createdAt : a.createdAt).getTime() -
      new Date(dir === 'desc' ? a.createdAt : b.createdAt).getTime()
  );
