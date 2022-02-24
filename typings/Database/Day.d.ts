type DailyActivityEntity = {
  _id: string;
  penalty: boolean;
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
  rules: RulesEntity;
  streakCount?: number;
  //
};
