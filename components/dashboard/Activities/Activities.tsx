// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDay from 'actions/day/useGetDay';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { useEffect, useState } from 'react';
import styles from './Activities.module.scss';
// =========================

function ConditionalWrapper({
  children,
  twoItems,
}: {
  children: React.ReactNode | null;
  twoItems: boolean;
}) {
  const query = useMediaQ('min', 768);

  if (query) return <div className={styles.wrapper}>{children}</div>;

  return (
    <div className={styles['mobile-wrapper']}>
      <div
        className={styles.items}
        style={{ gridTemplateColumns: twoItems ? '100% 100%' : '' }}
      >
        {children}
      </div>
      <div className={styles.toggle}>
        <div className={styles.activity} />
        <div className={styles.penalty} />
      </div>
    </div>
  );
}

function ConditionalActivitiesWrapper({
  children,
  color,
}: {
  children: React.ReactNode | null;
  color: 'green-with-background' | 'red-with-background';
}) {
  const query = useMediaQ('min', 768);

  if (query)
    return (
      <ElementContainer color={color}>
        <div className={styles.activities}> {children}</div>
      </ElementContainer>
    );

  return <div className={styles['mobile-activities']}>{children}</div>;
}

// Reorder the cards when there are 3 items to start the first card in the left bottom
const getThreeItemClasses = (items: any[], i = 0, query = true) =>
  query
    ? ''
    : items.length === 3
    ? i === 0
      ? styles['bottom-right']
      : i === 2
      ? styles['bottom-left']
      : ''
    : '';

export default function Activities() {
  // Only set activities on mount -> this is done this way so that the activities.get end point doesn't
  // get called for every time that the activityCount get's updated (We don't use that data on this page)
  const [mounted, setMounted] = useState(false);
  const { data: activityEntities } = useGetActivities({ enabled: !mounted });
  useEffect(() => setMounted(true), []);

  const { data: day } = useGetDay(new Date());

  const query = useMediaQ('min', 768);

  // Grab activities from the daily snapshot to use the values that where used that day
  const activities = day?.activities?.map((activitySnapshot) => {
    const activity = activityEntities
      // filter inactive activities without count
      ?.filter((a) => a.status === 'active' || activitySnapshot.count)
      ?.find((a) => a._id === activitySnapshot._id);
    // Overwrite values with snapshot if they differ from current activity
    if (activity) return { ...activity, ...activitySnapshot };
    return undefined;
  });

  const goals = activities?.filter((a) => !a?.penalty);
  const penalties = activities?.filter((a) => a?.penalty);

  return (
    <ConditionalWrapper twoItems={!!(goals?.length && penalties?.length)}>
      {!!goals?.length && (
        <ConditionalActivitiesWrapper color="green-with-background">
          {goals.map(
            (goal, i) =>
              !!goal && (
                <div
                  className={getThreeItemClasses(goals, i, query)}
                  key={goal._id}
                >
                  <ActivityCard activity={goal} canEdit />
                </div>
              )
          )}
        </ConditionalActivitiesWrapper>
      )}
      {!!penalties?.length && (
        <ConditionalActivitiesWrapper color="red-with-background">
          {penalties.map(
            (penalty, i) =>
              !!penalty && (
                <div
                  className={getThreeItemClasses(penalties, i, query)}
                  key={penalty._id}
                >
                  <ActivityCard activity={penalty} canEdit />
                </div>
              )
          )}
        </ConditionalActivitiesWrapper>
      )}
    </ConditionalWrapper>
  );
}
