// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getRewards = () =>
  axios.get('/api/reward').then(({ data }) => data as RewardEntity[]);

export default function useGetRewards() {
  const { data } = useQuery('rewards', getRewards);

  return data;
}
