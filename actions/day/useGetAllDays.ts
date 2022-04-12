// Components==============
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getDays = () => axios.get('/api/day').then(({ data }) => data);

export default function useGetAllDays(options?: UseQueryOptions<DayEntity[]>) {
  const query = useQuery<DayEntity[]>('days', getDays, options);

  return query;
}
