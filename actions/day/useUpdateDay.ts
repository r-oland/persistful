// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { getDayString } from 'utils/getDayString';
// =========================

export default function useUpdateDay(day: Date) {
  const queryClient = useQueryClient();
  const key = getDayString(day);

  const mutation = useMutation(
    (data: Partial<DayEntity> & { id: string }) =>
      axios.put(`/api/day/${data.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('days');
        queryClient.invalidateQueries(['day', key]);
      },
    }
  );

  return mutation;
}
