// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { getLocalISOTime } from 'utils/getLocalISOTime';
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
  const dates = `${getLocalISOTime(startDate.getTime())} ${getLocalISOTime(
    endDate.getTime()
  )}`;

  const query = useQuery<RewardEntity[]>(
    ['rewards', key],
    () => getRewardsByDays(dates),
    options
  );

  return query;
}
