// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getUser = () =>
  axios.get('/api/user').then(({ data }) => data as UserEntity);

export default function useGetUser() {
  const { data } = useQuery('user', getUser);

  return data;
}
