// Components==============
import useAddDay from 'actions/day/useAddDay';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import useValidateStreaks from 'actions/user/useValidateStreaks';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
// =========================

function Effect() {
  const { data: user } = useGetUser();
  const validateStreaks = useValidateStreaks();
  const { data: today, isLoading } = useGetDay(new Date());
  const addDay = useAddDay();

  const lastValidationString = user
    ? new Date(user.lastValidation).toLocaleDateString()
    : undefined;
  const todayString = new Date().toLocaleDateString();

  useEffect(() => {
    if (!user) return;

    // set lastValidation when editing previous date
    if (lastValidationString !== todayString) validateStreaks.mutate();
  }, [lastValidationString, todayString]);

  // if today's day entity doesn't exists yet, add it
  useEffect(() => {
    if (isLoading || !!today) return;

    addDay.mutate();
  }, [!!today, isLoading]);

  return null;
}

export default function ValidateEffect() {
  const session = useSession();
  if (session.status === 'authenticated') return <Effect />;
  return null;
}
