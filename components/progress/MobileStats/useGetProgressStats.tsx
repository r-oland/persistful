// Components==============
import useGetProgressDays from 'actions/day/useGetProgressDays';
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
  const { range } = useContext(ProgressContext);

  const [displayData, setDisplayData] = useState(defaultState);

  const { data: days, isLoading } = useGetProgressDays();

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

    const startDate = range.from;
    const endDate = range.to;

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
