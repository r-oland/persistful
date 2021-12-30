// Components==============
import axios from 'axios';
import { useQuery } from 'react-query';
// =========================

const getDays = () =>
  axios.get('/api/day').then(({ data }) => data as DayEntity[]);

export default function useGetDays() {
  const { data } = useQuery('days', getDays);

  return data;
}
