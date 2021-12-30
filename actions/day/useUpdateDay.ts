// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateDay() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'days',
    (data: Partial<DayEntity> & { id: string }) =>
      axios.put(`/api/day/${data.id}`, data),
    {
      onSuccess: () => queryClient.invalidateQueries('days'),
    }
  );

  return mutation;
}
