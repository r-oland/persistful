// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getOpenRewards = () =>
  axios.get(`/api/reward/openRewards`).then(({ data }) => {
    // If no rewards are set, return a default reward
    if (data.length === 0) {
      return [
        {
          _id: 'new_reward',
          name: 'No reward set',
          image:
            'https://storage.googleapis.com/persistful-prod/rewards/61ed6e3a01b4c2b4d0377673/79e8bc1979f157f1c27978602.jpg',
          completedCycles: 0,
        },
      ];
    }

    // If there are rewards, return them
    return data;
  });

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
