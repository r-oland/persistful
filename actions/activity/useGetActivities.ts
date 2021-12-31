// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getActivities = () =>
  axios.get('/api/activity').then(({ data }) => data as ActivityEntity[]);

export default function useGetActivities() {
  const query = useQuery('activities', getActivities);

  return query;
}
