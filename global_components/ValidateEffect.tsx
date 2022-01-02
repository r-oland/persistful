// Components==============
import useGetUser from 'actions/user/useGetUser';
import useValidateStreaks from 'actions/user/useValidateStreaks';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { getDayString } from 'utils/getDayString';
// =========================

function Effect() {
  const [enabled, setEnabled] = useState(true);

  const { data: user } = useGetUser({
    enabled,
    onSuccess: () => setEnabled(false),
  });
  const validateStreaks = useValidateStreaks();

  useEffect(() => {
    if (!user) return;
    // set lastValidation when editing previous date
    const lastValidation = new Date(user.lastValidation);
    const today = new Date();

    if (getDayString(lastValidation) !== getDayString(today))
      validateStreaks.mutate();
  }, [user?.lastValidation]);

  return null;
}

export default function ValidateEffect() {
  const session = useSession();
  if (session.status === 'authenticated') return <Effect />;
  return null;
}
