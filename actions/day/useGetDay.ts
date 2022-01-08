// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { getLocalISOTime } from 'utils/getLocalISOTime';
// =========================

const getDay = async (date: string) =>
  axios.get(`/api/day/byDay/${date}`).then(({ data }) => data);

export default function useGetDay(
  date: Date,
  options?: UseQueryOptions<DayEntity>
) {
  const key = date.toLocaleDateString();

  const query = useQuery<DayEntity>(
    ['days', key],
    () =>
      // convert to local time
      getDay(getLocalISOTime(date.getTime())),
    options
  );

  return query;
}
