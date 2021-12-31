// Don't remove activity from db -> when creating new activity check if name already exists -> if it does reactivate this activity

type PatternEntity = {
  x: number;
  y: number;
  r: number;
  size: number;
  shape: 'triangle' | 'circle';
};

type ActivityEntity = {
  _id: string;
  userId: string;
  status: 'active' | 'inactive' | 'deleted';
  name: string;
  icon: string;
  enablePattern: boolean;
  pattern?: PatternEntity[];
  countMode: 'minutes' | 'times';
  countCalc?: number;
  createdAt: Date;
};
