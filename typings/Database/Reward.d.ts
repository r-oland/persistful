type RewardEntity = {
  _id: string;
  userId: string;
  name: string;
  image: string;
  productLink: string;
  startCycles: number;
  totalCycles: number;
  completedCycles: number;
  endDate?: Date;
  createdAt: Date;
};
