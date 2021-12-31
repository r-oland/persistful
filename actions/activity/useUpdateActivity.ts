// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'activities',
    (data: Partial<ActivityEntity> & { id: string }) =>
      axios.put(`/api/activity/${data.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activities');
        queryClient.invalidateQueries('user');
      },
    }
  );

  return mutation;
}
