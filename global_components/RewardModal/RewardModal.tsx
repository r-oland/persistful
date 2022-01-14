// Components==============
import { faCamera, faSave, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAddReward from 'actions/reward/useAddReward';
import Button from 'global_components/Button/Button';
import Input from 'global_components/Input/Input';
import Modal from 'global_components/Modal/Modal';
import Slider from 'global_components/Slider/Slider';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import { useCounter } from 'hooks/useCounter';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from './RewardModal.module.scss';
// =========================

export default function RewardModal({
  modalIsOpen,
  setModalIsOpen,
}: {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const addReward = useAddReward();

  const [name, setName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [totalCycles, setTotalCycles] = useState(30);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [image, setImage] = useState('');

  const maxSlider = 120;

  const counter = useCounter({ valueTo: totalCycles });

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const firstFile = e.target.files[0];
    setFile(firstFile);

    const fileToString = URL.createObjectURL(firstFile);
    setImage(fileToString);
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return alert('No image set');

    addReward.mutate({
      name,
      totalCycles,
      image: '',
      productLink,
      completedCycles: 0,
    });
  };

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      color="green"
    >
      <form className={styles.wrapper} onSubmit={handleSave}>
        <div>
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
            onChange={(e) => setName(e.target.value)}
            placeholder="A big juicy carrot"
          />
        </div>
        <div className={styles.middle}>
          <div className={styles.left}>
            <div>
              <p className={styles['sub-title']}>Product link</p>
              <Input
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder="https://vegtablemarket.com/bjc"
              />
            </div>
            <div>
              <p className={styles['sub-title']}>Amount of cycles</p>
              <Slider
                initialValue={totalCycles}
                max={maxSlider}
                min={1}
                step={1}
                handleRelease={(value) => setTotalCycles(value)}
              />
            </div>
          </div>
          <div />
          <Image
            src="/images/carrot.svg"
            width={203}
            height={146}
            alt="carrot"
          />
        </div>
        <div className={styles.bottom}>
          <div className={styles['progress-circle']}>
            <SmallProgressCircle percentage={(100 / maxSlider) * totalCycles}>
              <h3>{counter}</h3>
            </SmallProgressCircle>
            <p>Streak cycles</p>
          </div>
          <div className={styles.buttons}>
            <Button color="red">
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
            <Button color="green" submit>
              <FontAwesomeIcon icon={faSave} /> Let's go
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
