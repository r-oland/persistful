// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddDay() {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => axios.post('/api/day'), {
    onSuccess: () => queryClient.invalidateQueries('days'),
  });

  return mutation;
}
