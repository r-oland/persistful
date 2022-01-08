// Components==============
import { faPlus, faSave, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAddActivity from 'actions/activity/useAddActivity';
import useGetActivities from 'actions/activity/useGetActivities';
import useUpdateActivity from 'actions/activity/useUpdateActivity';
import { AnimatePresence, motion } from 'framer-motion';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import Button from 'global_components/Button/Button';
import Box from 'global_components/Checkbox/Box';
import Checkbox from 'global_components/Checkbox/Checkbox';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import Input from 'global_components/Input/Input';
import Slider from 'global_components/Slider/Slider';
import Toggle from 'global_components/Toggle/Toggle';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
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
  enablePattern: false,
} as ActivityEntity;

export default function EditView() {
  const { data: activities } = useGetActivities();
  const updateActivity = useUpdateActivity();
  const addActivity = useAddActivity();
  const { selectedActivity, setSelectedActivity } =
    useContext(ActivitiesContext);
  const newActivity = selectedActivity === 'new-activity';
  const activity = activities?.find((a) => selectedActivity === a._id);
  const localActivity = activity || defaultValues;

  // states
  const [isToggled, setIsToggled] = useState(
    newActivity ? defaultValues.penalty : activity?.status === 'active'
  );
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
      enablePattern,
    }));

  const handleAddActivity = () => {
    if (!name) return;

    addActivity.mutateAsync({ ...defaultValues, ...saveObject }).then((r) => {
      setTimeout(() => {
        setSelectedActivity(r.data?._id || r.data?.insertedId);
      }, 100);
    });
  };

  const handleDeleteActivity = () => {
    if (!activity?._id) return;

    updateActivity
      .mutateAsync({
        id: activity._id,
        status: 'deleted',
      })
      .then(() => setSelectedActivity('new-activity'));
  };

  const handleSaveActivity = () => {
    if (!name || !activity?._id) return;
    updateActivity.mutate({
      ...saveObject,
      id: activity._id,
    });
  };
  //

  const penaltyMode = newActivity ? isToggled : activity?.penalty;
  const inactive = !newActivity && !isToggled;
  const showSlider = saveObject?.countMode
    ? saveObject.countMode === 'times'
    : localActivity.countMode === 'times';

  return (
    <div className={styles.wrapper}>
      <div className={styles.element}>
        <ElementContainer color={penaltyMode ? 'red' : 'green'}>
          <div className={styles.content}>
            <div>
              <b>
                {newActivity
                  ? isToggled
                    ? 'Penalty activity'
                    : 'Persistful activity'
                  : 'Active'}
              </b>
              {newActivity && (
                <p className={styles.description}>
                  {isToggled
                    ? "Adding time to a penalty activity hinders you in achieving you'r daily progress. It's a pretty effective way of getting rid of bad habits."
                    : 'Adding time to a persistful activity builds up your streak! Ideale this should be something that you enjoy doing.'}
                </p>
              )}
              <Toggle
                isToggled={isToggled}
                onClick={handleToggle}
                penalty={penaltyMode}
              />
            </div>
            <div
              className={`${styles['icon-input']} ${
                inactive ? styles.inactive : ''
              }`}
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
                <p>Count activity in x amount of times instead of time</p>
              </Checkbox>
            </div>
            <AnimatePresence>
              {showSlider && (
                <motion.div
                  {...framerFade}
                  initial={{ opacity: activity?.countMode === 'times' ? 1 : 0 }}
                  className={inactive ? styles.inactive : ''}
                >
                  <b>Calculated minutes per count</b>
                  <Slider
                    initialValue={
                      saveObject?.countCalc || localActivity.countCalc
                    }
                    handleRelease={handleCountCalcChange}
                    penalty={penaltyMode}
                    min={10}
                    max={120}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className={`${styles['preview-wrapper']} ${
                inactive ? styles.inactive : ''
              }`}
            >
              <div className={styles['column-1']}>
                <b>Preview</b>
                <ActivityCard
                  activity={{ ...localActivity, ...saveObject }}
                  disableAnimations
                  activities={activities}
                />
              </div>
              <div>
                <b>Pattern</b>
                <div className={styles['pattern-wrapper']}>
                  <Checkbox
                    initialValue={localActivity.enablePattern}
                    penalty={penaltyMode}
                    onClick={handleEnablePatternChange}
                  >
                    <p>Enable</p>
                  </Checkbox>
                  <Box penalty={penaltyMode}>
                    <p>Randomize</p>
                  </Box>
                </div>
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
                  <Button color="red" onClick={handleDeleteActivity}>
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
        </ElementContainer>
      </div>
    </div>
  );
}
