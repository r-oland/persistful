// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export type UpdateActivityCountTypes = {
  id: string;
  activityId: string;
  value: number;
};

export default function useUpdateActivityCount() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: UpdateActivityCountTypes) =>
      axios.put(`/api/day/updateActivityCount`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('days');
        queryClient.invalidateQueries('activities');
      },
    }
  );

  return mutation;
}
