// Components==============
import Modal from 'global_components/Modal/Modal';
import React from 'react';
import Content from './Content';
// =========================

export default function RewardModal({
  setModalIsOpen,
  reward,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reward?: RewardEntity;
}) {
  return (
    <Modal setModalIsOpen={setModalIsOpen} color="green">
      <Content setModalIsOpen={setModalIsOpen} reward={reward} />
    </Modal>
  );
}
