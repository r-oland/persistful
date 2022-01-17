// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateStreak() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: { id: string; difference: number }) =>
      axios.put(`/api/reward/updateStreak/${data.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rewards');
      },
    }
  );

  return mutation;
}
