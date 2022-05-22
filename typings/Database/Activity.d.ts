// Don't remove activity from db -> when creating new activity check if name already exists -> if it does reactivate this activity

type PatternEntity = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  r: number;
  size: number;
  shape: 'triangle' | 'circle';
};

type ActivityEntity = {
  _id: string;
  userId: string;
  penalty: boolean;
  status: 'active' | 'inactive' | 'deleted';
  name: string;
  icon: string;
  pattern?: PatternEntity[];
  count: number;
  countMode: 'minutes' | 'times';
  countCalc: number;
  createdAt: Date;
};
