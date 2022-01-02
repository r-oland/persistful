// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Omit<RewardEntity, '_id' | 'userId' | 'createdAt'>) =>
      axios.post('/api/reward', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries(['rewards', 'active']);
        queryClient.invalidateQueries('rewards');
      },
    }
  );

  return mutation;
}
