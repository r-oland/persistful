// can serve as unique key for useQuery hook
export const getDayString = (date: Date) =>
  `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
