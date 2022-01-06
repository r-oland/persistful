export const converMinutesToHours = (mins: number) => {
  const hours = Math.floor(mins / 60);
  const totalMins = mins % 60;
  const minutes = totalMins < 10 ? `0${totalMins}` : totalMins;

  return `${hours}:${minutes}`;
};
