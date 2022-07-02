// Components==============
import { faPlus, faSave, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAddActivity from 'actions/activity/useAddActivity';
import useDeleteActivity from 'actions/activity/useDeleteActivity';
import useGetActivities from 'actions/activity/useGetActivities';
import useUpdateActivity from 'actions/activity/useUpdateActivity';
import { AnimatePresence, motion } from 'framer-motion';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import Button from 'global_components/Button/Button';
import Box from 'global_components/Checkbox/Box';
import Checkbox from 'global_components/Checkbox/Checkbox';
import Input from 'global_components/Input/Input';
import Slider from 'global_components/Slider/Slider';
import Toggle from 'global_components/Toggle/Toggle';
import React, { useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import { generatePattern } from 'utils/generatePattern';
import styles from './EditView.module.scss';
import IconSelector from './IconSelector/IconSelector';
// =========================

const defaultValues = {
  status: 'active',
  penalty: false,
  name: 'New activity',
  count: 90,
  countMode: 'minutes',
  countCalc: 30,
  icon: 'book-spells',
} as ActivityEntity;

export default function Content({
  isToggled,
  setIsToggled,
  activity,
  handleSwitch,
  setDeleteModalIsOpen,
}: {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  activity?: ActivityEntity;
  handleSwitch: (id: string) => void;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: activities } = useGetActivities();
  const updateActivity = useUpdateActivity();
  const addActivity = useAddActivity();
  const deleteActivity = useDeleteActivity();
  const newActivity = !activity;
  const localActivity = activity || defaultValues;

  // states
  const [name, setName] = useState(localActivity.name);
  const [saveObject, setSaveObject] = useState<Partial<ActivityEntity>>(
    newActivity ? defaultValues : {}
  );
  //

  // functions
  const handleToggle = () => {
    setIsToggled((prev) => !prev);

    const currentToggle = !isToggled;

    if (newActivity)
      return setSaveObject((prev) => ({
        ...prev,
        penalty: currentToggle,
      }));

    // Bypass saveObject and save right away
    if (activity)
      return updateActivity.mutate({
        id: activity._id,
        status: currentToggle ? 'active' : 'inactive',
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveObject((prev) => ({ ...prev, name: e.target.value }));
    setName(e.target.value);
  };

  const handleCountModeChange = (countsInTimes: boolean) => {
    const recalculateCount = () => {
      // reset count to original
      if (countsInTimes && localActivity.countMode === 'times')
        return localActivity.count;

      // reset count to original
      if (!countsInTimes && localActivity.countMode === 'minutes')
        return localActivity.count;

      //  calculate minutes to times
      if (countsInTimes) return localActivity.count / localActivity.countCalc;

      // calculate times to minutes
      return localActivity.count * localActivity.countCalc;
    };

    // reset countCalc in case it was changed
    const conditionalReset = saveObject.countCalc
      ? { countCalc: localActivity.countCalc }
      : {};

    setSaveObject((prev) => ({
      ...prev,
      ...conditionalReset,
      countMode: !countsInTimes ? 'minutes' : 'times',
      count: recalculateCount(),
    }));
  };

  const handleCountCalcChange = (value: number) => {
    setSaveObject((prev) => ({ ...prev, countCalc: value }));
  };

  const handleEnablePatternChange = (enablePattern: boolean) =>
    setSaveObject((prev) => ({
      ...prev,
      pattern: enablePattern ? generatePattern() : undefined,
    }));

  const handleRandomizePattern = () =>
    setSaveObject((prev) => ({
      ...prev,
      pattern: generatePattern(),
    }));

  const handleAddActivity = () => {
    if (!name) return;

    addActivity.mutateAsync({ ...defaultValues, ...saveObject }).then((r) => {
      setTimeout(() => {
        handleSwitch(r.data?._id || r.data?.insertedId);
      }, 100);
    });
  };

  const handleSaveActivity = () => {
    if (!name || !activity?._id) return;
    updateActivity
      .mutateAsync({
        ...saveObject,
        id: activity._id,
      })
      .then(() => handleSwitch(activity._id));
  };

  const handleDelete = () => {
    if (!activity?._id) return;

    // if activity has no history, immediately delete it
    if (!activity.count)
      return deleteActivity
        .mutateAsync(activity._id)
        .then(() => handleSwitch('new-activity'));

    // else open confirm modal
    setDeleteModalIsOpen(true);
  };
  //

  const penaltyMode = newActivity ? isToggled : activity?.penalty;
  const inactive = !newActivity && !isToggled;
  const showSlider = saveObject?.countMode
    ? saveObject.countMode === 'times'
    : localActivity.countMode === 'times';

  // check if there are already 4 active penalties or activities
  const already4Active =
    activities
      ?.filter((a) => a.status === 'active')
      .filter((a) => (penaltyMode ? a.penalty : !a.penalty)).length === 4;

  const hideToggle = activity?.status === 'inactive' && already4Active;

  return (
    <div className={styles.content}>
      {hideToggle && (
        <p className={styles['inactive-message']}>
          You can only have 4 active {penaltyMode ? 'penalties' : 'activities'}{' '}
          at the same time. Set another {penaltyMode ? 'penalty' : 'activity'}{' '}
          to inactive to activate or edit this one.
        </p>
      )}
      <div className={hideToggle ? styles.inactive : ''}>
        <b className={newActivity ? styles['activity-type'] : ''}>
          {newActivity
            ? isToggled
              ? 'Penalty activity'
              : 'Persistful activity'
            : 'Active'}
        </b>
        {newActivity && (
          <p className={styles.description}>
            {isToggled
              ? "Performing penalty activities will hinder you in achieving your daily goals. It's a pretty effective way of getting rid of bad habits."
              : 'Performing persistful activities is the way to build up your streak! A little tip, pick something that you enjoy doing. This will make persisting streaks a piece of cake.'}
          </p>
        )}
        <Toggle
          isToggled={isToggled}
          onClick={handleToggle}
          penalty={penaltyMode}
        />
      </div>
      <div
        className={`${styles['icon-input']} ${inactive ? styles.inactive : ''}`}
      >
        <IconSelector
          penalty={!!penaltyMode}
          icon={saveObject?.icon || localActivity.icon}
          setSaveObject={setSaveObject}
        />
        <Input
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
          color={penaltyMode ? 'red' : 'green'}
        />
      </div>
      <div className={inactive ? styles.inactive : ''}>
        <b>Count mode</b>
        <Checkbox
          initialValue={localActivity.countMode === 'times'}
          penalty={penaltyMode}
          onClick={handleCountModeChange}
        >
          <p>
            Count the number of times an action is performed instead of the
            amount of minutes
          </p>
        </Checkbox>
      </div>
      <AnimatePresence>
        {showSlider && (
          <div className={inactive ? styles.inactive : ''}>
            <motion.div
              {...framerFade}
              initial={{
                opacity: activity?.countMode === 'times' ? 1 : 0,
              }}
            >
              <b>Calculated minutes per count</b>
              <Slider
                initialValue={saveObject?.countCalc || localActivity.countCalc}
                onChange={handleCountCalcChange}
                penalty={penaltyMode}
                min={10}
                max={120}
                time
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div
        className={`${styles['preview-wrapper']} ${
          inactive ? styles.inactive : ''
        }`}
      >
        <div>
          <b>Pattern</b>
          <div className={styles['pattern-wrapper']}>
            <Checkbox
              initialValue={!!localActivity.pattern}
              penalty={penaltyMode}
              onClick={handleEnablePatternChange}
            >
              <p>Enable</p>
            </Checkbox>
            {!!(saveObject.pattern
              ? saveObject.pattern
              : localActivity.pattern) && (
              <Box penalty={penaltyMode} onClick={handleRandomizePattern}>
                <p>Randomize</p>
              </Box>
            )}
          </div>
        </div>
        <div className={styles['column-2']}>
          <b>Preview</b>
          <ActivityCard
            activity={{ ...localActivity, ...saveObject }}
            disableAnimations
            activities={activities}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        {newActivity ? (
          <Button
            color={penaltyMode ? 'red' : 'green'}
            onClick={handleAddActivity}
          >
            <FontAwesomeIcon icon={faPlus} /> Add activity
          </Button>
        ) : (
          <>
            <Button color="red" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
            <Button
              color="green"
              onClick={handleSaveActivity}
              inactive={inactive}
            >
              <FontAwesomeIcon icon={faSave} /> Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
