// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

type OmitTypes = '_id' | 'userId' | 'createdAt' | 'completedCycles';

export default function useAddReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Omit<RewardEntity, OmitTypes>) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      return axios.post('/api/reward', formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries(['rewards']);
      },
    }
  );

  return mutation;
}
