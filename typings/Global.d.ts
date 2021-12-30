type Test = {
  users: UserEntity;
  activities: ActivityEntity;
  rewards: RewardEntity;
  days: DayEntity;
};

type DbEntities = 'users' | 'activities' | 'rewards' | 'days';
