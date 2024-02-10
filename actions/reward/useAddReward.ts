// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

type OmitTypes = '_id' | 'userId' | 'createdAt' | 'completedCycles';

export default function useAddReward() {
  const queryClient = useQueryClient();
  let shouldInvalidateUser = false;

  const mutation = useMutation(
    (data: Omit<RewardEntity & { setToActive: boolean }, OmitTypes>) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      if (data.setToActive) shouldInvalidateUser = true;

      return axios.post('/api/reward', formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['rewards']);
        if (shouldInvalidateUser) queryClient.invalidateQueries('user');
      },
    }
  );

  return mutation;
}
