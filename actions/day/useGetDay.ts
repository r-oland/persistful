// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { getDayString } from 'utils/getDayString';
import { getLocalISOTime } from 'utils/getLocalISOTime';
// =========================

const getDay = async (date: string) =>
  axios.get(`/api/day/byDay/${date}`).then(({ data }) => data);

export default function useGetDay(
  date: Date,
  options?: UseQueryOptions<DayEntity>
) {
  const key = getDayString(date);

  const query = useQuery<DayEntity>(
    ['day', key],
    () =>
      // convert to local time
      getDay(getLocalISOTime(date.getTime())),
    options
  );

  return query;
}
