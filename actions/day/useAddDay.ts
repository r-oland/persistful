// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { getDayString } from 'utils/getDayString';
// =========================

export default function useAddDay() {
  const queryClient = useQueryClient();
  const today = new Date();
  const key = getDayString(today);

  const mutation = useMutation(() => axios.post('/api/day'), {
    onSuccess: () => queryClient.invalidateQueries(['day', key]),
  });

  return mutation;
}
