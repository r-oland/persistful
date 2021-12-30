// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
// =========================

const updateUser = (data: Partial<UserEntity>) =>
  axios.put('/api/user', data).then((r) => r.data);

export default function useUpdateUser() {
  const queryClient = useQueryClient();

  const test = useMutation(
    'user',
    (data: Partial<UserEntity>) => updateUser(data),
    {
      onMutate: async (newVal) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('user');

        // Snapshot of previous value
        const prev = queryClient.getQueryData<UserEntity>('user');

        // Optimistically update to the new value
        if (prev) {
          queryClient.setQueryData<UserEntity>('user', { ...prev, ...newVal });
        }

        // Return a context with the previous value
        return prev;
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context) queryClient.setQueryData('user', context);
      },
    }
  );

  return test;
}
