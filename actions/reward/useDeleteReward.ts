// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useDeleteReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (id: string) => axios.delete(`/api/reward/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
      },
    }
  );

  return mutation;
}
