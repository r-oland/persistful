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
};
