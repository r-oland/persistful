// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
import { getDayString } from 'utils/getDayString';
import { getLocalISOTime } from 'utils/getLocalISOTime';
// =========================

const getDay = async (date: string) =>
  axios.get(`/api/day/byDay/${date}`).then(({ data }) => data as DayEntity);

export default function useGetDay(date: Date) {
  const key = getDayString(date);

  const query = useQuery(['day', key], () =>
    // convert to local time
    getDay(getLocalISOTime(date.getTime()))
  );

  return query;
}
