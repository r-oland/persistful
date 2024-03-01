// Components==============
import axios from 'axios';
import { ProgressContext } from 'pages/progress';
import { useContext } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { isWithinInterval } from 'date-fns';
// =========================

const getDays = () => axios.get('/api/day').then(({ data }) => data);

export default function useGetProgressDays(
  options?: UseQueryOptions<DayEntity[]> & { allDays?: boolean }
) {
  const { range } = useContext(ProgressContext);

  const query = useQuery<DayEntity[]>(['days', 'progress'], getDays, {
    select: (data) =>
      options?.allDays
        ? data
        : data.filter((d) =>
            isWithinInterval(new Date(d.createdAt), {
              start: range.from,
              end: range.to,
            })
          ),
    ...options,
  });

  return query;
}
