// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const validateStreaks = () =>
  axios
    .put('/api/user/validateStreaks')
    .then((r) => r.data as { startDateGeneralStreak?: Date });

export default function useValidateStreaks(params?: {
  noRewardInvalidation?: boolean;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation(validateStreaks, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      // No reward invalidation is to bypass bug where rewards are invalidated twice and the latest value is overwritten
      if (params?.noRewardInvalidation) return;
      queryClient.invalidateQueries('rewards');
    },
  });

  return mutation;
}
