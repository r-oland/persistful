// Components==============
import useGetDays from 'actions/day/useGetDays';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { ProgressContext } from 'pages/progress';
import { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
// =========================

const defaultState: {
  totalTime: string;
  averageTime: string;
  totalCycles: number;
  daysTracked: number;
  startDate: Date;
  endDate: Date;
} = {
  totalTime: '0:00',
  averageTime: '0:00',
  totalCycles: 0,
  daysTracked: 0,
  startDate: new Date(),
  endDate: new Date(),
};

export default function useGetProgressStats() {
  const { isLoading, range } = useContext(ProgressContext);

  const [displayData, setDisplayData] = useState(defaultState);

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days } = useGetDays(range[0], range[1]);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (!days && !isLoading) return setDisplayData(defaultState);
    if (isLoading) return;

    const totalTime =
      days
        ?.map((d) => getDayAchievements(d).total)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const averageTime = totalTime / (days?.length || 1);

    const totalCycles =
      days
        ?.map((d) => getDayAchievements(d).streak)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const daysTracked = days?.length || 0;

    const startDate = range[0];
    const endDate = range[1];

    return setDisplayData({
      totalTime: convertMinutesToHours(totalTime),
      averageTime: convertMinutesToHours(averageTime),
      totalCycles,
      daysTracked,
      startDate,
      endDate,
    });
  }, [useDeepComparison(days), isLoading]);

  return displayData;
}
