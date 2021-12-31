type RewardEntity = {
  _id: string;
  userId: string;
  name: string;
  image: string;
  totalCycles: number;
  completedCycles: number;
  status: 'active' | 'inactive' | 'completed';
  endDate?: Date;
  createdAt: Date;
};
