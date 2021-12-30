// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

export default function useUpdateReward() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'rewards',
    (data: Partial<RewardEntity> & { id: string }) =>
      axios.put(`/api/reward/${data.id}`, data),
    {
      onSuccess: () => queryClient.invalidateQueries('rewards'),
    }
  );

  return mutation;
}
