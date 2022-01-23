// Components==============
import {
  faCamera,
  faSave,
  faThumbsDown,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAddReward from 'actions/reward/useAddReward';
import useDeleteReward from 'actions/reward/useDeleteReward';
import useUpdateReward from 'actions/reward/useUpdateReward';
import Button from 'global_components/Button/Button';
import Input from 'global_components/Input/Input';
import Slider from 'global_components/Slider/Slider';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import { useCounter } from 'hooks/useCounter';
import useGetRewardCycles from 'hooks/useGetRewardCycles';
import { useMediaQ } from 'hooks/useMediaQ';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './RewardModal.module.scss';
// =========================

export default function Content({
  setModalIsOpen,
  reward,
}: {
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  reward?: RewardEntity;
}) {
  const addReward = useAddReward();
  const updateReward = useUpdateReward();
  const deleteReward = useDeleteReward();

  const [saveObject, setSaveObject] = useState<Partial<RewardEntity>>({});
  const [localImage, setLocalImage] = useState('');

  const name = saveObject?.name || reward?.name || '';
  const productLink = saveObject?.productLink || reward?.productLink || '';
  const totalCycles = saveObject?.totalCycles || reward?.totalCycles || 30;
  const image = localImage || reward?.image || '';
  const completedCycles = useGetRewardCycles(reward);
  const minSlider = completedCycles + 1;
  const maxSlider = 120;

  const totalCounter = useCounter({ valueTo: totalCycles });
  const { push } = useRouter();
  const query = useMediaQ('min', 768);

  const handleClose = () =>
    setModalIsOpen ? setModalIsOpen(false) : push('/');

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    // @ts-ignore
    setSaveObject((prev) => ({ ...prev, image: e.target.files[0] }));
    setLocalImage(URL.createObjectURL(e.target.files[0]));
  }

  const handleRedButton = () => {
    handleClose();
    if (reward) return deleteReward.mutate(reward._id);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add new reward
    if (!reward) {
      if (!saveObject.image) return alert('No image set');

      addReward.mutate({
        name,
        totalCycles,
        image: saveObject.image,
        productLink,
      });
      return handleClose();
    }

    // Update existing reward
    updateReward.mutate({
      ...saveObject,
      id: reward._id,
    });
    handleClose();
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSave}>
      <div className={styles.top}>
        <h3 className={styles.title}>
          What do you wan't to dangle to the end of your stick?
        </h3>
        <p className={styles.description}>
          Wether it be a fancy new piece of equipment, a new book or a nice
          thick carrot, we all like treating ourself from time to time. Let
          you're next treat be the thing that drives you to glory and honor!
        </p>
      </div>
      <div className={styles['upload-image-wrapper']}>
        <label htmlFor="upload">
          {image ? (
            <Image src={image} width={40} height={40} />
          ) : (
            <div className={styles['upload-image']}>
              <FontAwesomeIcon icon={faCamera} />
            </div>
          )}
          <input type="file" id="upload" onChange={handleImageUpload} />
        </label>
        <Input
          value={name}
          onChange={(e) =>
            setSaveObject((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="A big juicy carrot"
        />
      </div>
      <div className={styles.middle}>
        <div className={styles.left}>
          <div>
            <p className={styles['sub-title']}>Product link</p>
            <Input
              value={productLink}
              onChange={(e) =>
                setSaveObject((prev) => ({
                  ...prev,
                  productLink: e.target.value,
                }))
              }
              placeholder="https://vegtablemarket.com/bjc"
            />
          </div>
          <div>
            <p className={styles['sub-title']}>Amount of cycles</p>
            <Slider
              initialValue={totalCycles}
              max={maxSlider}
              min={minSlider}
              step={1}
              handleRelease={(value) =>
                setSaveObject((prev) => ({ ...prev, totalCycles: value }))
              }
            />
          </div>
        </div>
        <div />
        <Image src="/images/carrot.svg" width={203} height={146} alt="carrot" />
      </div>
      <div className={styles.bottom}>
        <div className={styles['progress-circle']}>
          <SmallProgressCircle
            percentage={
              reward
                ? (100 / totalCycles) * completedCycles
                : (100 / maxSlider) * totalCycles
            }
          >
            {reward ? (
              <p className={styles.counter}>
                {completedCycles}/{totalCounter}
              </p>
            ) : (
              <h3>{totalCounter}</h3>
            )}
          </SmallProgressCircle>
          <p>Streak cycles</p>
        </div>
        <div className={styles.buttons}>
          <Button color="red" onClick={handleRedButton}>
            <FontAwesomeIcon icon={reward ? faTrash : faThumbsDown} />{' '}
            {reward ? 'Delete' : 'Not my style'}
          </Button>
          <Button color="green" submit>
            <FontAwesomeIcon icon={faSave} /> {reward ? 'Save' : "Let's go!"}
          </Button>
        </div>
      </div>
    </form>
  );
}
