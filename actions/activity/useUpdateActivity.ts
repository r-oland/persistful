// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateActivity() {
  const queryClient = useQueryClient();
  let data: Partial<ActivityEntity>;

  const mutation = useMutation(
    (d: Partial<ActivityEntity> & { id: string }) => {
      data = d;
      return axios.put(`/api/activity/${d.id}`, d);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activities');

        if (
          data?.penalty !== undefined ||
          data?.countMode ||
          data?.countCalc ||
          data?.count
        ) {
          queryClient.invalidateQueries('days');
        }
      },
    }
  );

  return mutation;
}
