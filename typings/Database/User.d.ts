type RulesEntity = {
  dailyGoal: number;
  secondChange: boolean;
  prm: boolean;
};

type UserEntity = {
  _id: string;
  email: string;
  image?: string;
  emailVerified?: string;
  activities: ActivityEntity[];
  firstName?: string;
  rules: RulesEntity;
  streak: number;
  activeReward?: string;
  createdAt: Date;
};
