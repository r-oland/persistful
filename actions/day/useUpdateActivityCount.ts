// Components==============
import axios from 'axios';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { DashboardContext } from 'pages/index';
// =========================

export type UpdateActivityCountTypes = {
  id: string;
  activityId: string;
  value: number;
};

export default function useUpdateActivityCount() {
  const queryClient = useQueryClient();
  const { setInvalidateActivitiesQuery } = useContext(DashboardContext);

  const mutation = useMutation(
    (data: UpdateActivityCountTypes) =>
      axios
        .put(`/api/day/updateActivityCount`, data)
        .then((r) => r.data as { oldStreak: number; newStreak: number }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('days');
        // invalidate query after user has left dashboard page
        setInvalidateActivitiesQuery(true);
      },
    }
  );

  return mutation;
}
