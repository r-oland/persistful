// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateReward() {
  const queryClient = useQueryClient();
  let shouldInvalidateUser = false;

  const mutation = useMutation(
    (
      data: Partial<RewardEntity & { setToActive: boolean }> & { id: string }
    ) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      if (data.setToActive) shouldInvalidateUser = true;

      return axios.put(`/api/reward/${data.id}`, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
        if (shouldInvalidateUser) queryClient.invalidateQueries('user');
      },
    }
  );

  return mutation;
}
