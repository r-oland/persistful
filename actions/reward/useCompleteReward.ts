// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useCompleteReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (id: string) => axios.put(`/api/reward/complete/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
        queryClient.invalidateQueries('user');
      },
    }
  );

  return mutation;
}
