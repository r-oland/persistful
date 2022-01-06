// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Omit<ActivityEntity, '_id' | 'userId' | 'createdAt' | 'count'>) =>
      axios.post('/api/activity', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activities');
        queryClient.invalidateQueries('days');
      },
    }
  );

  return mutation;
}
