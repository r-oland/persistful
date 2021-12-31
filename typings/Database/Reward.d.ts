type RewardEntity = {
  _id: string;
  userId: string;
  name: string;
  image: string;
  totalCycles: number;
  earnedCycles?: number;
  endDate?: Date;
  createdAt: Date;
};
