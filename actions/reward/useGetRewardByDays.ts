// Components==============
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getRewardsByDays = async (date: string) =>
  axios.get(`/api/reward/byDays/${date}`).then(({ data }) => data);

export default function useGetRewardsByDays(
  startDate: Date,
  endDate: Date,
  options?: UseQueryOptions<RewardEntity[]>
) {
  const key = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // convert to local time
  const dates = `${formatISO(startDate)} ${formatISO(endDate)}`;

  const query = useQuery<RewardEntity[]>(
    ['rewards', key],
    () => getRewardsByDays(dates),
    options
  );

  return query;
}
