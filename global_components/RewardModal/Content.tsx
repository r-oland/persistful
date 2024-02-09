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
import { useMediaQ } from 'hooks/useMediaQ';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import Checkbox from 'global_components/Checkbox/Checkbox';
import styles from './RewardModal.module.scss';
// =========================

export default function Content({
  setModalIsOpen,
  reward,
}: {
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  reward?: RewardEntity;
}) {
  const { data: user } = useGetUser();
  const addReward = useAddReward();
  const updateReward = useUpdateReward();
  const updateUser = useUpdateUser();
  const deleteReward = useDeleteReward();

  const isActiveReward = user?.activeReward === reward?._id;

  const [saveObject, setSaveObject] = useState<Partial<RewardEntity>>({});
  const [localImage, setLocalImage] = useState('');
  const [fileToLarge, setFileToLarge] = useState(false);
  const [isActive, setIsActive] = useState(isActiveReward);

  const name =
    saveObject?.name !== undefined ? saveObject.name : reward?.name || '';
  const totalCycles = saveObject?.totalCycles || reward?.totalCycles || 30;
  const minCycles = saveObject?.minCycles || reward?.minCycles || 10;
  const mode = saveObject?.mode || reward?.mode || 'reset';
  const image = localImage || reward?.image || '';
  const completedCycles = reward?.completedCycles || 0;
  const minSlider = completedCycles + 1;
  const maxSlider = 120;

  const totalCounter = useCounter(totalCycles);
  const { push } = useRouter();
  const query = useMediaQ('min', 768);

  const handleClose = () =>
    setModalIsOpen ? setModalIsOpen(false) : push('/');

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    if (e.target.files[0].size > 3000000) return setFileToLarge(true);
    setFileToLarge(false);

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

    if (isActive)
      updateUser.mutate({
        activeReward: reward?._id,
      });

    // Add new reward
    if (!reward) {
      if (!saveObject.image) return alert('No image set');

      addReward.mutate({
        name,
        totalCycles,
        mode,
        image: saveObject.image,
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

  useEffect(() => {
    if (mode === 'streak') setSaveObject((prev) => ({ ...prev, minCycles }));
  }, [mode]);

  return (
    <form className={styles.wrapper} onSubmit={handleSave}>
      {!query && (
        <Image src="/images/carrot.svg" width={203} height={146} alt="carrot" />
      )}
      <div className={styles.top}>
        <div>
          <h3 className={styles.title}>
            What do you want to dangle to the end of a stick?
          </h3>
        </div>
        <p className={styles.description}>
          Choose a reward. This could be a product, an activity or maybe a day
          off. Use your imagination!
        </p>
      </div>
      <div>
        {fileToLarge && (
          <p className={styles['to-large']}>
            Oops! I think this file ate to much carrots... The maximum upload
            size is 3MB.
          </p>
        )}
        <div className={styles['upload-image-wrapper']}>
          <label htmlFor="upload">
            {image ? (
              <Image src={image} width={40} height={40} alt="Reward image" />
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
      </div>
      <div
        className={`${styles['cycles-slider-wrapper']} ${!isActiveReward ? styles.inactive : ''}`}
      >
        {!isActiveReward && (
          <div>
            <p className={styles['sub-title']}>Active</p>
            <Checkbox
              externalValue={isActive}
              externalOnClick={() => setIsActive((prev) => !prev)}
              big
            >
              <></>
            </Checkbox>
          </div>
        )}
        <div>
          <p className={styles['sub-title']}>Amount of cycles</p>
          <Slider
            initialValue={totalCycles}
            max={maxSlider}
            min={minSlider}
            step={1}
            onChange={(value) =>
              setSaveObject((prev) => ({ ...prev, totalCycles: value }))
            }
          />
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles['mode-wrapper']}>
          <p className={styles['sub-title']}>Reward mode</p>
          <div className={styles['checkbox-wrapper']}>
            <div>
              <Checkbox
                externalValue={mode === 'reset'}
                externalOnClick={() =>
                  setSaveObject((prev) => ({ ...prev, mode: 'reset' }))
                }
              >
                <span>Reset your reward streak on failure of daily streak</span>
              </Checkbox>
            </div>
            <div>
              <Checkbox
                externalValue={mode === 'streak'}
                externalOnClick={() =>
                  setSaveObject((prev) => ({ ...prev, mode: 'streak' }))
                }
              >
                <span>
                  Don’t reset reward streak on daily streak failure, but only
                  start counting from <b>{minCycles}</b> streaks
                </span>
              </Checkbox>
            </div>
          </div>
          {mode === 'streak' && (
            <Slider
              initialValue={minCycles}
              max={50}
              min={0}
              step={1}
              onChange={(value) =>
                setSaveObject((prev) => ({ ...prev, minCycles: value }))
              }
              hideValue
            />
          )}
        </div>
        {query && (
          <>
            <div />
            <Image
              src="/images/carrot.svg"
              width={203}
              height={155}
              alt="carrot"
            />
          </>
        )}
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
