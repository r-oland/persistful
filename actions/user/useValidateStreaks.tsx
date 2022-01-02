// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const validateStreaks = () =>
  axios.put('/api/user/validateStreaks').then((r) => r.data);

export default function useValidateStreaks() {
  const [enabled, setEnabled] = useState(true);

  const { data: activeReward } = useGetActiveReward({
    enabled,
    onSuccess: () => setEnabled(false),
  });

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
