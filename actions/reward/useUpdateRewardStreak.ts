// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export type UpdateRewardStreakTypes = {
  oldStreak: number;
  newStreak: number;
};

export default function useUpdateRewardStreak() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: UpdateRewardStreakTypes) =>
      axios
        .put(`/api/reward/updateStreak`, data)
        .then((res) => res.data as { completedReward: boolean }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
      },
    }
  );

  return mutation;
}
