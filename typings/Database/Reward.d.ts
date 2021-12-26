type RewardEntity = {
  _id: string;
  name: string;
  image: string;
  totalCycles: number;
  earnedCycles?: number;
  startDate: Date;
  endDate?: Date;
};
