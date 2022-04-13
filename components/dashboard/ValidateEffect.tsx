// Components==============
import useAddDay from 'actions/day/useAddDay';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import useValidateStreaks from 'actions/user/useValidateStreaks';
import { useSession } from 'next-auth/react';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect } from 'react';
// =========================

function Effect() {
  const { data: user } = useGetUser();
  const validateStreaks = useValidateStreaks();
  const { activeDay } = useContext(DashboardContext);
  const { data: day, isLoading } = useGetDay(activeDay);
  const addDay = useAddDay();

  const lastValidationString = user
    ? new Date(user.lastValidation).toLocaleDateString()
    : undefined;
  const todayString = new Date().toLocaleDateString();

  useEffect(() => {
    // Make sure new day is added before dispatching validate streak
    if (!user || !day) return;

    // set lastValidation when editing previous date
    if (lastValidationString !== todayString) validateStreaks.mutate();
  }, [lastValidationString, todayString, !!day]);

  // if today's day entity doesn't exists yet, add it
  useEffect(() => {
    if (isLoading || !!day) return;

    addDay.mutate();
  }, [!!day, isLoading]);

  return null;
}

export default function ValidateEffect() {
  const session = useSession();
  if (session.status === 'authenticated') return <Effect />;
  return null;
}
