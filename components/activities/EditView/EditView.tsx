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
import Toggle from 'global_components/Toggle/Toggle';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext, useEffect, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './EditView.module.scss';
import IconSelector from './IconSelector/IconSelector';
// =========================

const defaultPreviewItems = {
  status: 'active',
  penalty: false,
  name: 'New item',
  count: 90,
  countMode: 'minutes',
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

  // states
  const [counter, setCounter] = useState(0);
  const [isToggled, setIsToggled] = useState(
    newActivity ? defaultPreviewItems.penalty : activity?.status === 'active'
  );
  const [name, setName] = useState(
    (newActivity ? defaultPreviewItems.name : activity?.name) || ''
  );
  const [countMode, setCountMode] = useState(
    newActivity
      ? defaultPreviewItems.countMode === 'times'
      : activity?.countMode === 'times'
  );
  const [enablePattern, setEnablePattern] = useState(
    newActivity ? defaultPreviewItems.enablePattern : !!activity?.enablePattern
  );
  const [saveObject, setSaveObject] = useState<Partial<ActivityEntity>>(
    newActivity ? defaultPreviewItems : {}
  );
  //

  // Set toggle value to save object
  useEffect(() => {
    if (counter > 0) {
      if (newActivity)
        return setSaveObject((prev) => ({ ...prev, penalty: isToggled }));

      setSaveObject((prev) => ({
        ...prev,
        status: isToggled ? 'active' : 'inactive',
      }));
    }

    setCounter(1);
  }, [isToggled]);

  const penaltyMode = newActivity ? isToggled : activity?.penalty;

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
                setIsToggled={setIsToggled}
                penalty={penaltyMode}
              />
            </div>
            <div className={styles['icon-input']}>
              <IconSelector
                penalty={!!penaltyMode}
                icon={saveObject.icon || activity?.icon || 'book-spells'}
                setSaveObject={setSaveObject}
              />
              <Input
                value={name}
                onChange={(e) => {
                  setSaveObject((prev) => ({ ...prev, name: e.target.value }));
                  setName(e.target.value);
                }}
                placeholder="Name"
                color={penaltyMode ? 'red' : 'green'}
              />
            </div>
            <div>
              <b>Count mode</b>
              <div
                onClick={() => {
                  setCountMode((prev) => !prev);
                  setSaveObject((prev) => ({
                    ...prev,
                    countMode: countMode ? 'minutes' : 'times',
                  }));
                }}
                className={styles.checkbox}
              >
                <Checkbox isChecked={countMode} penalty={penaltyMode} />
                <p>Count activity in x amount of times instead of time</p>
              </div>
            </div>
            <AnimatePresence>
              {countMode && (
                <motion.div
                  {...framerFade}
                  initial={{ opacity: activity?.countMode === 'times' ? 1 : 0 }}
                >
                  <b>Calculated minutes per count</b>
                  <div>slider</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={styles['preview-wrapper']}>
              <div className={styles['column-1']}>
                <b>Preview</b>
                <ActivityCard
                  activity={
                    activity
                      ? { ...activity, ...saveObject }
                      : { ...defaultPreviewItems, ...saveObject }
                  }
                />
              </div>
              <div>
                <b>Pattern</b>
                <div className={styles['pattern-wrapper']}>
                  <div
                    className={styles.checkbox}
                    onClick={() => {
                      setEnablePattern((prev) => !prev);
                      setSaveObject((prev) => ({
                        ...prev,
                        enablePattern: !enablePattern,
                      }));
                    }}
                  >
                    <Checkbox isChecked={enablePattern} penalty={penaltyMode} />
                    <p>Enable</p>
                  </div>
                  <div className={styles.checkbox}>
                    <Box penalty={penaltyMode} />
                    <p>Randomize</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              {newActivity ? (
                <Button
                  color={penaltyMode ? 'red' : 'green'}
                  onClick={() => {
                    if (!name) return;

                    addActivity
                      .mutateAsync({ ...defaultPreviewItems, ...saveObject })
                      .then((r) => {
                        setTimeout(() => {
                          setSelectedActivity(
                            r.data?._id || r.data?.insertedId
                          );
                        }, 100);
                      });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add activity
                </Button>
              ) : activity ? (
                <>
                  <Button
                    color="red"
                    onClick={() => {
                      updateActivity
                        .mutateAsync({
                          id: activity._id,
                          status: 'deleted',
                        })
                        .then(() => setSelectedActivity('new-activity'));
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </Button>
                  <Button
                    color="green"
                    onClick={() => {
                      if (!name) return;
                      updateActivity.mutate({
                        ...saveObject,
                        id: activity._id,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> Save
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </ElementContainer>
      </div>
    </div>
  );
}
