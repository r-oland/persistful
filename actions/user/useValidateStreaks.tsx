// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const validateStreaks = () =>
  axios.put('/api/user/validateStreaks').then((r) => r.data);

export default function useValidateStreaks() {
  const { data: activeReward } = useGetActiveReward();

  const queryClient = useQueryClient();

  const mutation = useMutation(validateStreaks, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      // if reward is active, update rewards
      if (
        activeReward &&
        activeReward.completedCycles !== activeReward.totalCycles
      ) {
        queryClient.invalidateQueries('rewards');
      }
    },
  });

  return mutation;
}
