// Components==============
import axios from 'axios';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { DashboardContext } from 'pages/index';
import { setDateTime } from 'utils/setDateTime';
import { add } from 'date-fns';
import { validateStreaks } from 'actions/user/useValidateStreaks';
// =========================

export type UpdateActivityCountTypes = {
  id: string;
  activityId: string;
  value: number;
  activeDay: Date;
  user?: UserEntity;
  setDisplayOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedRewardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const updateActivityCount = async ({
  id,
  activityId,
  value,
  activeDay,
  user,
  setDisplayOverlay,
  setCompletedRewardModalIsOpen,
}: UpdateActivityCountTypes) => {
  const activityResponse = await axios.put(`/api/day/updateActivityCount`, {
    id,
    activityId,
    value,
  });

  const { oldStreak, newStreak } = activityResponse.data as {
    oldStreak: number;
    newStreak: number;
  };

  const todayStamp = new Date().toLocaleDateString();
  const activeDayStamp = activeDay.toLocaleDateString();

  let startDateStreak = user?.startDateGeneralStreak;

  // If you mutate day entities in the past, make sure the validateStreak action runs to update streaks accordingly
  if (todayStamp !== activeDayStamp) {
    const { startDateGeneralStreak } = await validateStreaks();
    startDateStreak = startDateGeneralStreak;
  }

  const activityIsUpdatedInStreak =
    setDateTime(
      startDateStreak
        ? // Previous day so rewards streak can also be decreased when the startDate is the same as the active day
          add(new Date(startDateStreak), { days: -1 })
        : // If there is no startDateGeneralStreak, we assume the streak started today
          new Date(),
      'start'
    ).getTime() <= activeDay.getTime();

  // Check if day was edited that is part of the current streak
  if (activityIsUpdatedInStreak) {
    const { completedReward } = await axios
      .put(`/api/reward/updateStreak`, { oldStreak, newStreak })
      .then((res) => res.data as { completedReward: boolean });

    // Open completed reward modal when reward has been completed
    if (completedReward) setCompletedRewardModalIsOpen(true);
  }

  // close interactive overlay
  setDisplayOverlay(false);
};

export default function useUpdateActivityCount() {
  const queryClient = useQueryClient();
  const { setInvalidateActivitiesQuery } = useContext(DashboardContext);

  const mutation = useMutation(updateActivityCount, {
    onSuccess: () => {
      queryClient.invalidateQueries('days');
      queryClient.invalidateQueries('rewards');
      queryClient.invalidateQueries('user');
      // invalidate query after user has left dashboard page
      setInvalidateActivitiesQuery(true);
    },
  });

  return mutation;
}
