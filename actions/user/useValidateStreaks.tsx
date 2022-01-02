// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const validateStreaks = () =>
  axios.put('/api/user/validateStreaks').then((r) => r.data);

export default function useValidateStreaks() {
  const queryClient = useQueryClient();
  const { data: activeReward } = useGetActiveReward();

  const mutation = useMutation(validateStreaks, {
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
  });

  return mutation;
}
