// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'activities',
    (data: Omit<ActivityEntity, '_id' | 'userId'>) =>
      axios.post('/api/activity', data),
    {
      onSuccess: () => queryClient.invalidateQueries('activities'),
    }
  );

  return mutation;
}
