// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddDay() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'days',
    (data: Omit<DayEntity, '_id' | 'userId' | 'activities'>) =>
      axios.post('/api/day', data),
    {
      onSuccess: () => queryClient.invalidateQueries('days'),
    }
  );

  return mutation;
}
