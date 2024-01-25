type RulesEntity = {
  dailyGoal: number;
  secondChange: boolean;
  // no migration done yet so it can be undefined
  balance?: boolean;
  prm: boolean;
  bonusTime: number;
};

type UserEntity = {
  _id: string;
  email: string;
  image?: string;
  emailVerified?: string;
  firstName?: string;
  rules: RulesEntity;
  streak: number;
  createdAt: Date;
  activeReward: string;
  lastValidation: Date;
  secondChanceDates?: Date[];
  startDateGeneralStreak?: Date;
  finishedOnboarding: boolean;
  subscription?: string;
};
