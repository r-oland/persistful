import { getDayString } from 'utils/getDayString';
// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useAddActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Omit<ActivityEntity, '_id' | 'userId' | 'createdAt'>) =>
      axios.post('/api/activity', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activities');

        const key = getDayString(new Date());
        queryClient.invalidateQueries(['days', key]);
      },
    }
  );

  return mutation;
}
