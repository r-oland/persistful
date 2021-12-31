type DailyActivityEntity = {
  activity: ActivityEntity;
  count: number;
};

type DayEntity = {
  _id: string;
  userId: string;
  currentGoal: number;
  activities: DailyActivityEntity[];
  createdAt: Date;
};
