type ActivityEntity = {
  _id: string;
  name: string;
  icon: string;
  countMode: boolean;
  countCalc?: number;
  customization?: { x: number; y: number }[];
};
