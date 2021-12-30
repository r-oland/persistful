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
  activities: string[];
  firstName?: string;
  rules: RulesEntity;
  streak: number;
  activeReward?: string;
};
