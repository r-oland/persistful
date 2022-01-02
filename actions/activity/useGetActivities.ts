// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getActivities = () => axios.get('/api/activity').then(({ data }) => data);

export default function useGetActivities(
  options?: UseQueryOptions<ActivityEntity[]>
) {
  const query = useQuery<ActivityEntity[]>(
    'activities',
    getActivities,
    options
  );

  return query;
}
