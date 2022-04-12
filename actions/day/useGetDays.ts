// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { getLocalISOTime } from 'utils/getLocalISOTime';
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
  const dates = `${getLocalISOTime(startDate.getTime())} ${getLocalISOTime(
    endDate.getTime()
  )}`;

  const query = useQuery<DayEntity[]>(
    ['days', key],
    () => getDays(dates),
    options
  );

  return query;
}
