type DailyActivityEntity = {
  activity: ActivityEntity;
  count: number;
};

type DayEntity = {
  _id: string;
  date: Date;
  currentGoal: number;
  activities: DailyActivityEntity[];
};
