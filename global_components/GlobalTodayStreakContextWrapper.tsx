// Components==============
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import React, { createContext, useMemo } from 'react';
import { getAchievedStreaks } from 'utils/getAchievedStreaks';
// =========================

type GlobalTodayStreakContextType = {
  todayStreak: number;
  flatTodayStreak: number;
};

export const GlobalTodayStreakContext = createContext(
  {} as GlobalTodayStreakContextType
);

export default function GlobalTodayStreakContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useGetUser();
  const { data: day } = useGetDay(new Date());

  const todayStreak = getAchievedStreaks(day, user, true);
  const flatTodayStreak = Math.floor(todayStreak);

  const value = useMemo(
    () => ({ todayStreak, flatTodayStreak }),
    [todayStreak]
  );

  return (
    <GlobalTodayStreakContext.Provider value={value}>
      {children}
    </GlobalTodayStreakContext.Provider>
  );
}