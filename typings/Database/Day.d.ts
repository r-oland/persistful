type DailyActivityEntity = {
  activity: ActivityEntity;
  count: number;
};

type DayEntity = {
  _id: string;
  userId: string;
  activities: DailyActivityEntity[];
  createdAt: Date;
};
