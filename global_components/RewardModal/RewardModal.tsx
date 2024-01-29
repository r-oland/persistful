// Components==============
import Modal from 'global_components/Modal/Modal';
import React from 'react';
import Content from './Content';
// =========================

export default function RewardModal({
  setSelectedReward,
  reward,
}: {
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  reward?: RewardEntity;
}) {
  return (
    <Modal setModalIsOpen={() => setSelectedReward('initial')} color="green">
      <Content
        setModalIsOpen={() => setSelectedReward('initial')}
        reward={reward}
      />
    </Modal>
  );
}
