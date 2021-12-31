// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'rewards',
    (data: Omit<RewardEntity, '_id' | 'userId' | 'createdAt'>) =>
      axios.post('/api/reward', data),
    {
      onSuccess: () => queryClient.invalidateQueries('rewards'),
    }
  );

  return mutation;
}
