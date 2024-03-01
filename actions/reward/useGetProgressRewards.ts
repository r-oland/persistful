// Components==============
import axios from 'axios';
import { isWithinInterval } from 'date-fns';
import { ProgressContext } from 'pages/progress';
import { useContext } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
// =========================

const getAllRewards = async () =>
  axios.get(`/api/reward/all`).then(({ data }) => data);

export default function useGetProgressRewards(
  options?: UseQueryOptions<RewardEntity[]>
) {
  const { range } = useContext(ProgressContext);

  const query = useQuery<RewardEntity[]>(['rewards', 'all'], getAllRewards, {
    select: (data) =>
      data.filter((d) =>
        isWithinInterval(new Date(d.createdAt), {
          start: range.from,
          end: range.to,
        })
      ),
    ...options,
  });

  return query;
}
