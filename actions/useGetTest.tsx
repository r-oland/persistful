// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getMongo = () =>
  axios.get('/api/mongo').then(({ data }) => data as ActivityEntity);

export default function useGetTest() {
  const { data } = useQuery('all-test', getMongo);

  return data;
}
