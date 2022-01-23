// Components==============
import { GlobalTodayStreakContext } from 'global_components/GlobalTodayStreakContextWrapper';
import { useContext } from 'react';
// =========================

export default function useGetRewardCycles(reward?: RewardEntity) {
  const { flatTodayStreak } = useContext(GlobalTodayStreakContext);

  if (!reward) return 0;

  // subtract start cycle count if it was created today. after day 1 it get's calculated in validateStreak
  const createdAt = new Date(reward.createdAt).toLocaleDateString();
  const today = new Date().toLocaleDateString();
  const createdToday = createdAt === today;
  const startCyclePenalty = createdToday ? reward.startCycles : 0;

  const completedCycles =
    reward.completedCycles + flatTodayStreak - startCyclePenalty;

  return completedCycles;
}
