// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDay from 'actions/day/useGetDay';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useMediaQ } from 'hooks/useMediaQ';
import { DashboardContext } from 'pages';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Activities.module.scss';
// =========================

type MobileActivityCardsContextType = {
  setOverlayIsDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MobileActivityCardsContext = createContext(
  {} as MobileActivityCardsContextType
);

function ConditionalWrapper({
  children,
  twoItems,
}: {
  children: React.ReactNode | null;
  twoItems: boolean;
}) {
  const query = useMediaQ('min', 768);
  const ref = useRef<HTMLDivElement>(null);
  const [penalty, setPenalty] = useState(false);
  const [overlayIsDisplayed, setOverlayIsDisplayed] = useState(false);

  const contextValue = useMemo(() => ({ setOverlayIsDisplayed }), []);

  if (query) return <div className={styles.wrapper}>{children}</div>;

  const getScrollPosition = (value: number) => {
    if (!ref.current) return;
    if (value > ref.current.clientWidth / 2) return setPenalty(true);

    if (penalty) setPenalty(false);
  };

  return (
    <MobileActivityCardsContext.Provider value={contextValue}>
      <div className={styles['mobile-wrapper']}>
        <div
          className={styles.items}
          style={{
            gridTemplateColumns: twoItems ? '100% 100%' : '',
            overflow: overlayIsDisplayed ? 'hidden' : 'auto',
          }}
          ref={ref}
          onScroll={(e: any) => getScrollPosition(e.target.scrollLeft)}
        >
          {children}
        </div>
        {twoItems && (
          <div
            className={`${styles.toggle} ${
              penalty ? styles['is-penalty'] : ''
            }`}
          >
            <div className={styles.activity} />
            <div className={styles.penalty} />
          </div>
        )}
      </div>
    </MobileActivityCardsContext.Provider>
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
        <div className={styles.activities}>{children}</div>
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
  const [displayActivities, setDisplayActivities] = useState<ActivityEntity[]>(
    []
  );

  const { data: activityEntities } = useGetActivities();

  const { activeDay } = useContext(DashboardContext);
  const { data: day } = useGetDay(activeDay);

  const query = useMediaQ('min', 768);

  const goals = displayActivities?.filter((a) => !a?.penalty);
  const penalties = displayActivities?.filter((a) => a?.penalty);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (day && activityEntities?.length) {
      // Grab activities from the daily snapshot to use the values that where used that day
      const activities = day?.activities
        ?.map((activitySnapshot) => {
          const activity = activityEntities
            // filter inactive activities without count
            ?.filter((a) => a.status === 'active' || activitySnapshot.count)
            ?.find((a) => a._id === activitySnapshot._id);
          // Overwrite values with snapshot if they differ from current activity
          if (activity) return { ...activity, ...activitySnapshot };
          return undefined;
        })
        .filter((exists) => exists);

      // @ts-ignore
      if (activities) setDisplayActivities(activities);
    }
  }, [useDeepComparison(day), !!activityEntities?.length]);

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
                  style={{
                    scrollSnapAlign: (goals.length === 3 ? i === 2 : i === 0)
                      ? 'start'
                      : '',
                  }}
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
                  style={{ scrollSnapAlign: i === 0 ? 'start' : '' }}
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
