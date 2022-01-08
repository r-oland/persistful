export const converMinutesToHours = (mins: number) => {
  const roundedMins = Math.floor(mins);

  const hours = Math.floor(roundedMins / 60);
  const totalMins = roundedMins % 60;
  const minutes = totalMins < 10 ? `0${totalMins}` : totalMins;

  return `${hours}:${minutes}`;
};
