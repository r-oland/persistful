// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const updateStreak = (data: {
  direction: 'inc' | 'dec';
  activeRewardId?: string;
}) => axios.put('/api/user/streak', data).then((r) => r.data);

export default function useUpdateStreak(activeRewardId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'user',
    (data: { direction: 'inc' | 'dec' }) =>
      updateStreak({ ...data, activeRewardId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        if (activeRewardId) {
          queryClient.invalidateQueries('active-reward');
          queryClient.invalidateQueries('rewards');
        }
      },
    }
  );

  return mutation;
}
