// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getActivities = () =>
  axios.get('/api/activity').then(({ data }) => data as ActivityEntity[]);

export default function useGetActivities() {
  const { data } = useQuery('activities', getActivities);

  return data;
}
