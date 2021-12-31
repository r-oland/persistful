type DailyActivityEntity = {
  activity: ActivityEntity; // snapshot -> persist calc data of that day, be able to display deleted activities & don't perform query each time you get data
  count: number;
};

type DayEntity = {
  _id: string;
  userId: string;
  currentGoal: number;
  activities: DailyActivityEntity[];
  createdAt: Date;
};
