// Components==============
import useGetDay from 'actions/day/useGetDay';
import { useSession } from 'next-auth/react';
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

function Context({ children }: { children: React.ReactNode }) {
  const { data: day } = useGetDay(new Date());

  const todayStreak = getAchievedStreaks(day, true);
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

export default function GlobalTodayStreakContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  if (session.status === 'authenticated') return <Context>{children}</Context>;
  return <>{children}</>;
}
