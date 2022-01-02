// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getActiveReward = () =>
  axios.get(`/api/reward/activeReward`).then(({ data }) => data);

export default function useGetActiveReward(
  options?: UseQueryOptions<RewardEntity>
) {
  const query = useQuery<RewardEntity>(
    'active-reward',
    getActiveReward,
    options
  );

  return query;
}
