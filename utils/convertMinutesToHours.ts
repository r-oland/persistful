const getMinutes = (mins: number) => {
  // negative
  if (mins < 0) {
    if (mins > -10) {
      return `0${Math.abs(mins)}`;
    }

    return Math.abs(mins);
  }

  // positive
  if (mins < 10) return `0${mins}`;

  return mins;
};

export const convertMinutesToHours = (mins: number) => {
  const roundedMins = Math.floor(mins);

  const totalHours = roundedMins / 60;
  const hours =
    totalHours >= 0
      ? Math.floor(totalHours)
      : `-${Math.floor(Math.abs(totalHours))}`;
  const totalMins = roundedMins % 60;
  const minutes = getMinutes(totalMins);

  return `${hours}:${minutes}`;
};
