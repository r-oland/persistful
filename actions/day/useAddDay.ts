import { useContext } from 'react';
// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { DashboardContext } from 'pages';
// =========================

export default function useAddDay() {
  const queryClient = useQueryClient();

  const { activeDay } = useContext(DashboardContext);

  const mutation = useMutation(() => axios.post('/api/day', activeDay), {
    onSuccess: () => queryClient.invalidateQueries('days'),
  });

  return mutation;
}
