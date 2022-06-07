// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useDeleteActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (id: string) => axios.delete(`/api/activity/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activities');
        queryClient.invalidateQueries('days');
      },
    }
  );

  return mutation;
}
