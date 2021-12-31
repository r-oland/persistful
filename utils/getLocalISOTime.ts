const offsetTime = new Date().getTimezoneOffset() * 60000;

export const getLocalISOTime = (date: number) =>
  new Date(date - offsetTime).toISOString().slice(0, -1);
