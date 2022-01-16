// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Partial<RewardEntity> & { id: string }) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      return axios.put(`/api/reward/${data.id}`, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
      },
    }
  );

  return mutation;
}
