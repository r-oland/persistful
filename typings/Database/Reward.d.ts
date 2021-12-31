type RewardEntity = {
  _id: string;
  userId: string;
  name: string;
  image: string;
  totalCycles: number;
  completedCycles: number;
  endDate?: Date;
  createdAt: Date;
};
