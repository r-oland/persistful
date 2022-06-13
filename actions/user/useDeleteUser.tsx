// Components==============
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useMutation } from 'react-query';
// =========================

export default function useDeleteUser() {
  const mutation = useMutation(() => axios.delete(`/api/user`), {
    onSuccess: () => signOut(),
  });

  return mutation;
}
