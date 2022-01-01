type DailyActivityEntity = {
  id: string;
  countMode: 'minutes' | 'times';
  countCalc?: number;
  count: number;
};

type DayEntity = {
  _id: string;
  userId: string;
  activities: DailyActivityEntity[];
  createdAt: Date;
  // For persisting history
  dailyGoal: number;
  streakCount?: number;
  //
};
