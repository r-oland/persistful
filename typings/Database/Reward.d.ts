type RewardEntity = {
  _id: string;
  userId: string;
  name: string;
  image: string;
  mode: 'reset' | 'streak';
  minCycles?: number;
  totalCycles: number;
  completedCycles: number;
  endDate?: Date;
  createdAt: Date;
};
