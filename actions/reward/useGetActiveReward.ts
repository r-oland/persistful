// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getActiveReward = () =>
  axios
    .get(`/api/reward/activeReward`)
    .then(({ data }) => data as RewardEntity);

export default function useGetActiveReward() {
  const query = useQuery('active-reward', () => getActiveReward());

  return query;
}
