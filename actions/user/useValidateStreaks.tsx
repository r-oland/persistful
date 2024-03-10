// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export const validateStreaks = (activeDay: Date) =>
  axios
    .put('/api/user/validateStreaks', { activeDay })
    .then((r) => r.data as { startDateGeneralStreak?: Date });

export default function useValidateStreaks() {
  const queryClient = useQueryClient();

  const mutation = useMutation(validateStreaks, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      queryClient.invalidateQueries('rewards');
    },
  });

  return mutation;
}
