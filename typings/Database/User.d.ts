type RuleSettingsEntity = {
  dailyGoal: number;
  secondChange: boolean;
  prm: boolean;
};

type AccountSettingsEntity = {
  firstName: string;
  lastName: string;
  email: string;
};

type UserEntity = { _id: string; streak: number } & RuleSettingsEntity &
  AccountSettingsEntity;
