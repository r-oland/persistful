// Components==============
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { setDateTime } from 'utils/setDateTime';
// =========================

export const getStartEndWeek = (dayEntry: Date, boundMonth?: boolean) => {
  const monthStart = setDateTime(startOfMonth(dayEntry), 'middle');
  const monthEnd = setDateTime(endOfMonth(dayEntry), 'middle');

  const weekStart = setDateTime(
    startOfWeek(dayEntry, { weekStartsOn: 1 }),
    'middle'
  );
  const weekEnd = setDateTime(
    endOfWeek(dayEntry, { weekStartsOn: 1 }),
    'middle'
  );

  const conditionalStart = new Date(
    Math.max(monthStart.getTime(), weekStart.getTime())
  );
  const conditionalEnd = new Date(
    Math.min(monthEnd.getTime(), weekEnd.getTime())
  );

  const firstDay = boundMonth ? conditionalStart : weekStart;
  const lastDay = boundMonth ? conditionalEnd : weekEnd;

  return { firstDay, lastDay };
};
