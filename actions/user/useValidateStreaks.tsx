// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export const validateStreaks = () =>
  axios
    .put('/api/user/validateStreaks')
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
