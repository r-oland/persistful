// Components==============
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useQuery, UseQueryOptions } from 'react-query';
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
      getDay(formatISO(date)),
    options
  );

  return query;
}
