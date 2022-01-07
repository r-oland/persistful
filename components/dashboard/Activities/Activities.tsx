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

  return <div>{children}</div>;
}

export default function Activities() {
  // Only set activities on mount -> this is done this way so that the activities.get end point doesn't
  // get called for every time that the activityCount get's updated (We don't use that data on this page)
  const [mounted, setMounted] = useState(false);
  const { data: activityEntities } = useGetActivities({ enabled: !mounted });
  useEffect(() => setMounted(true), []);

  const { data: day } = useGetDay(new Date());

  // Grab activities from the daily snapshot to use the values that where used that day
  const activities = day?.activities?.map((activitySnapshot) => {
    const activity = activityEntities?.find(
      (a) => a._id === activitySnapshot._id
    );
    // Overwrite values with snapshot if they differ from current activity
    if (activity) return { ...activity, ...activitySnapshot };
    return undefined;
  });

  const goals = activities?.filter((a) => !a?.penalty);
  const penalties = activities?.filter((a) => a?.penalty);

  return (
    <div className={styles.wrapper}>
      {!!goals?.length && (
        <ConditionalWrapper color="green-with-background">
          {goals.map(
            (goal) =>
              !!goal && <ActivityCard activity={goal} key={goal._id} canEdit />
          )}
        </ConditionalWrapper>
      )}
      {!!penalties?.length && (
        <ConditionalWrapper color="red-with-background">
          {penalties.map(
            (penalty) =>
              !!penalty && (
                <ActivityCard activity={penalty} key={penalty._id} canEdit />
              )
          )}
        </ConditionalWrapper>
      )}
    </div>
  );
}
