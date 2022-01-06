// Components==============
import useAddActivity from 'actions/activity/useAddActivity';
import useGetActivities from 'actions/activity/useGetActivities';
import Button from 'global_components/Button/Button';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
// =========================

export default function Activities() {
  const { data: activities } = useGetActivities();
  const addActivity = useAddActivity();

  return (
    <div>
      {activities?.map((a) => (
        <div key={a._id}>
          <p>{a.name}</p>
          <strong>{getActivityCount(a)}</strong>
        </div>
      ))}
      <Button
        onClick={() =>
          addActivity.mutate({
            countMode: 'times',
            enablePattern: false,
            icon: 'sack-dollar',
            name: 'Food delivery',
            penalty: true,
            countCalc: 30,
            status: 'active',
          })
        }
      >
        add activity
      </Button>
    </div>
  );
}
