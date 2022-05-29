// Components==============
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getDays = async (date: string) =>
  axios.get(`/api/day/byDays/${date}`).then(({ data }) => data);

export default function useGetDays(
  startDate: Date,
  endDate: Date,
  options?: UseQueryOptions<DayEntity[]>
) {
  const key = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // convert to local time
  const dates = `${formatISO(startDate)} ${formatISO(endDate)}`;

  const query = useQuery<DayEntity[]>(
    ['days', key],
    () => getDays(dates),
    options
  );

  return query;
}
