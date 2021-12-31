// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddDay() {
  const queryClient = useQueryClient();
  const today = new Date();

  // serves as unique key for useQuery hook
  const key = `${today.getUTCFullYear()}/${
    today.getUTCMonth() + 1
  }/${today.getUTCDate()}`;

  const mutation = useMutation('days', () => axios.post('/api/day'), {
    onSuccess: () => queryClient.invalidateQueries(['day', key]),
  });

  return mutation;
}
