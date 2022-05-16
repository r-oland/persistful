type RulesEntity = {
  dailyGoal: number;
  secondChange: boolean;
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
  lastSecondChance?: Date;
};
