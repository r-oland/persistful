// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getUser = () => axios.get('/api/user').then(({ data }) => data);

export default function useGetUser(options?: UseQueryOptions<UserEntity>) {
  const query = useQuery<UserEntity>('user', getUser, options);

  return query;
}
