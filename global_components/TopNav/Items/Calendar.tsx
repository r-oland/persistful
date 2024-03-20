// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RangeCalendar from 'global_components/Calendar/RangeCalendar';
import { DashboardContext } from 'pages';
import { ProgressContext } from 'pages/progress';
import React, { useContext } from 'react';
import { framerTopNavChild } from 'utils/framerAnimations';
// =========================

export default function CalendarComponent({
  page,
}: {
  page: 'dashboard' | 'progress';
}) {
  const { activeDay, setActiveDay } = useContext(DashboardContext);
  const { range, setRange, month, setMonth } = useContext(ProgressContext);

  return (
    <motion.div variants={framerTopNavChild}>
      {page === 'dashboard' ? (
        <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
      ) : (
        <RangeCalendar
          range={range}
          setRange={setRange}
          month={month}
          setMonth={setMonth}
        />
      )}
    </motion.div>
  );
}
