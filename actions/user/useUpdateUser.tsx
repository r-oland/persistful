// Components==============
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { getDayString } from 'utils/getDayString';
// =========================

const updateUser = (data: Partial<UserEntity>) =>
  axios.put('/api/user', data).then((r) => r.data);

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  let newUserData: Partial<UserEntity>;

  const mutation = useMutation(
    (data: Partial<UserEntity>) => {
      newUserData = data;
      return updateUser(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');

        if (newUserData?.rules?.dailyGoal) {
          const key = getDayString(new Date());
          queryClient.invalidateQueries(['days', key]);
        }
      },
    }
  );

  return mutation;
}
