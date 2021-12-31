// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
import { getLocalISOTime } from 'utils/getLocalISOTime';
// =========================

const getDay = async (date: string) =>
  axios.get(`/api/day/byDay/${date}`).then(({ data }) => data as DayEntity);

export default function useGetDay(date?: Date) {
  const today = new Date();
  const day = date || today;

  // serves as unique key for useQuery hook
  const key = `${day.getUTCFullYear()}/${
    day.getUTCMonth() + 1
  }/${day.getUTCDate()}`;

  const { data } = useQuery(['day', key], () =>
    // convert to local time
    getDay(getLocalISOTime(day.getTime()))
  );

  return data;
}
