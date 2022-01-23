// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getReward = (id: string) =>
  axios.get(`/api/reward/${id}`).then(({ data }) => data);

export default function useGetReward(
  options: UseQueryOptions<RewardEntity> & { id: string; key: string }
) {
  const query = useQuery<RewardEntity>(
    ['rewards', options.key],
    () => getReward(options.id),
    options
  );

  return query;
}
