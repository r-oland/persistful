// Don't remove activity from db -> when creating new activity check if name already exists -> if it does reactivate this activity

type ActivityEntity = {
  _id: string;
  userId: string;
  status: 'active' | 'inactive' | 'deleted';
  name: string;
  icon: string;
  countMode: boolean;
  countCalc?: number;
  customization?: { x: number; y: number }[];
};
