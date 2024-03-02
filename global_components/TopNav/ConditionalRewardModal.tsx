// Components==============
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import RewardModal from 'global_components/RewardModal/RewardModal';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
// =========================

export default function ConditionalRewardModal({
  selectedReward,
  setSelectedReward,
}: {
  selectedReward: string;
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: openRewards } = useGetOpenRewards();

  return (
    <AnimatePresence>
      {selectedReward !== 'initial' && (
        <RewardModal
          setSelectedReward={setSelectedReward}
          reward={openRewards?.find((or) => or._id === selectedReward)}
        />
      )}
    </AnimatePresence>
  );
}
