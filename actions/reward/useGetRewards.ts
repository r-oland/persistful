// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getRewards = () => axios.get('/api/reward').then(({ data }) => data);

export default function useGetRewards(
  options?: UseQueryOptions<RewardEntity[]>
) {
  const query = useQuery<RewardEntity[]>('rewards', getRewards, options);

  return query;
}
