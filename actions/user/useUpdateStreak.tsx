// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const updateStreak = (data: { direction: 'inc' | 'dec' }) =>
  axios.put('/api/user/streak', data).then((r) => r.data);

export default function useUpdateStreak() {
  const queryClient = useQueryClient();

  const { data: activeReward } = useGetActiveReward();

  const mutation = useMutation(
    'user',
    (data: { direction: 'inc' | 'dec' }) => updateStreak(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        // if reward is active, update rewards
        if (
          activeReward &&
          activeReward.completedCycles !== activeReward.totalCycles
        ) {
          queryClient.invalidateQueries('active-reward');
          queryClient.invalidateQueries('rewards');
        }
      },
    }
  );

  return mutation;
}
