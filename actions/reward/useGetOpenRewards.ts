// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getOpenRewards = () =>
  axios.get(`/api/reward/openRewards`).then(({ data }) => data);

export default function useGetOpenRewards(
  options?: UseQueryOptions<RewardEntity[]>
) {
  const query = useQuery<RewardEntity[]>(
    ['rewards', 'open'],
    getOpenRewards,
    options
  );

  return query;
}
