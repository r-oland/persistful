import { endOfWeek, startOfWeek } from 'date-fns';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';
import { getPastDay } from 'utils/getPastDay';
import { getPotentialSecondChanceDates } from 'utils/getPotentialSecondChanceDates';
import { setDateTime } from 'utils/setDateTime';
import { sortOnCreatedAt } from 'utils/sortOnCreatedAt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // get user
    const userId = session.user.uid;
    const _id = new ObjectId(userId);
    const users = await getCollection<UserEntity>('users');
    const user = await users.findOne({ _id });

    // get active reward with id from user model
    const activeRewardId = user?.activeReward;
    const rewards = await getCollection<RewardEntity>('rewards');
    const activeReward = await rewards.findOne({ _id: activeRewardId });

    // Set last validated to today
    await users.updateOne({ _id }, { $set: { lastValidation: new Date() } });

    // Helper func that resets streaks
    const reset = async () => {
      await users.updateOne(
        { _id },
        { $set: { streak: 0, secondChanceDates: undefined } }
      );
      if (activeReward)
        await rewards.updateOne(
          { _id: activeRewardId },
          { $set: { completedCycles: 0, startCycles: 0 } }
        );

      return res.status(200).send({ message: 'Streaks reset' });
    };

    const days = await getCollection<DayEntity>('days');

    // get yesterday
    const yesterdayDate = getPastDay(new Date(), 1);
    const yesterday = await days.findOne({
      userId,
      createdAt: {
        $gte: setDateTime(yesterdayDate, 'start'),
        $lt: setDateTime(yesterdayDate, 'end'),
      },
    });
    const yesterdayHasStreak = !!getDayAchievements(yesterday).streak;

    // get day before yesterday
    const dayBeforeYesterdayDate = getPastDay(new Date(), 2);
    const dayBeforeYesterday = await days.findOne({
      userId,
      createdAt: {
        $gte: setDateTime(dayBeforeYesterdayDate, 'start'),
        $lt: setDateTime(dayBeforeYesterdayDate, 'end'),
      },
    });
    const dayBeforeYesterdayHasStreak =
      !!getDayAchievements(dayBeforeYesterday).streak;

    if (yesterday ? yesterday.rules.secondChange : user?.rules.secondChange) {
      // If there is no entry from yesterday and the day before that reset the streak
      if (!yesterday && !dayBeforeYesterday) return await reset();

      // If daily goals weren't achieved, reset the streak
      if (!yesterdayHasStreak && !dayBeforeYesterdayHasStreak)
        return await reset();
    } else {
      // If there is no entry from yesterday reset the streak
      if (!yesterday) return await reset();

      // If daily goal wasn't achieved, reset the streak
      if (!yesterdayHasStreak) return await reset();
    }

    //
    // * Now it's clear that there is a streak (unless yesterday was not filled in and can use a second chance), so we need to calculate it. *
    //

    // Get all days except for today (today is calculated in front end)
    const dayEntitiesGetter = await days
      .find({
        userId,
        // exclude today
        createdAt: { $lt: setDateTime(new Date(), 'start') },
      })
      .toArray();

    const dayEntities = sortOnCreatedAt([...dayEntitiesGetter], 'asc');

    const descendingDayEntities = sortOnCreatedAt(
      [...dayEntitiesGetter],
      'desc'
    );

    // all items that could potentially use a second chance (not checked if it was used that week)
    let potentialSecondChanceDates: Date[][] = [];

    // loop over day entities to create a list of all second chance dates. It's important that this is done before
    // finding the index of the day that did not achieve it's goal.
    descendingDayEntities.every((d) => {
      // break loop
      if (!d?.rules.secondChange) return false;

      const oneDateAgo = getPastDay(d.createdAt, 1);
      const twoDatesAgo = getPastDay(d.createdAt, 2);

      const oneDayAgo = descendingDayEntities.find(
        (day) =>
          day.createdAt.toLocaleDateString() === oneDateAgo.toLocaleDateString()
      );

      const twoDaysAgo = descendingDayEntities.find(
        (day) =>
          day.createdAt.toLocaleDateString() ===
          twoDatesAgo.toLocaleDateString()
      );

      const dayHasStreak = !!getDayAchievements(d).streak;
      const dayAgoHasStreak = !!getDayAchievements(oneDayAgo).streak;
      const twoDaysAgoHasStreak = !!getDayAchievements(twoDaysAgo).streak;

      // neither day have a streak -> break loop
      if (!dayHasStreak && !dayAgoHasStreak) return false;

      // current day days has a streak and previous day has day entity -> ignore
      if (dayHasStreak && !!oneDayAgo) return true;

      // previous day does not exists, but the day before that does and has a streak -> use second chance
      if (dayHasStreak && !oneDayAgo && twoDaysAgoHasStreak) {
        const newValue = getPotentialSecondChanceDates(
          potentialSecondChanceDates,
          oneDateAgo
        );
        potentialSecondChanceDates = newValue;

        return true;
      }

      // current day has no streak, but previous does -> use second chance
      if (!dayHasStreak && dayAgoHasStreak) {
        const newValue = getPotentialSecondChanceDates(
          potentialSecondChanceDates,
          d.createdAt
        );
        potentialSecondChanceDates = newValue;

        return true;
      }

      // fallback
      return false;
    });

    // Their was no day created yesterday, but it might take advantage of the second chance rule
    if (user?.rules.secondChange && !yesterday && dayBeforeYesterdayHasStreak) {
      const weekStart = setDateTime(
        startOfWeek(yesterdayDate, { weekStartsOn: 1 }),
        'start'
      ).getTime();

      const weekEnd = setDateTime(
        endOfWeek(yesterdayDate, { weekStartsOn: 1 }),
        'end'
      ).getTime();

      // find if there are any second chance dates used in same week as yesterday day
      const yesterdayCanUseSecondChance = !potentialSecondChanceDates
        .flat()
        .find((d) => d.getTime() > weekStart && d.getTime() < weekEnd);

      // can't use second chance so reset te entire streak
      if (!yesterdayCanUseSecondChance) return await reset();

      // add yesterdayDate to potentialSecondChanceDates
      potentialSecondChanceDates = [
        ...potentialSecondChanceDates,
        [yesterdayDate],
      ];
    }

    // a list of potential second chances, filtered on allowing 1 per week
    const secondChanceDatesPerWeek = potentialSecondChanceDates
      // There are multiple second chances in 1 week. No second chances -> break streak on most recent day
      .filter((arr) => arr.length === 1)
      .flat();

    // get index of item that did not achieve goal
    const indexOfDateThatDidNotAchieveGoal = descendingDayEntities.findIndex(
      (d) => {
        const dayHasStreak = !!getDayAchievements(d).streak;

        // The first entity where the streak wasn't achieved
        if (!d?.rules.secondChange) return !dayHasStreak;

        /* 
          handle second chance 
        */

        const hasSecondChance = secondChanceDatesPerWeek
          .map((scd) => scd.toLocaleDateString())
          .includes(d.createdAt.toLocaleDateString());

        // used second chance -> ignore
        if (hasSecondChance) return false;

        // day has streak -> ignore
        if (dayHasStreak) return false;

        // Day has no streak and can't use a second chance -> break
        return true;
      }
    );

    const startDateGeneralStreak =
      descendingDayEntities[indexOfDateThatDidNotAchieveGoal - 1]?.createdAt ||
      // fallback
      new Date();

    // day entities that are used for calculating the general streak
    const generalStreakDays = dayEntities.filter((d) => {
      // Equalize hours to make sure that same days match
      const createdDate = setDateTime(d.createdAt, 'middle');
      const startDate = setDateTime(startDateGeneralStreak, 'middle');

      return createdDate >= startDate;
    });

    // total sum of all completed streak day cycles
    const total = generalStreakDays
      .map((day) => getDayAchievements(day).streak)
      .reduce((prev, cur) => prev + cur);

    // all dates that are using a second chance in the current streak
    const secondChanceDates = secondChanceDatesPerWeek.filter(
      // filter out potential dates that came before start streak
      (scd) => scd.getTime() > startDateGeneralStreak.getTime()
    );

    // update streak in user model
    await users.updateOne(
      { _id },
      { $set: { streak: total, secondChanceDates } }
    );

    if (activeReward && startDateGeneralStreak) {
      // if general streak if going on for longer then the reward streak -> activeReward.created_at
      // if general streak is later then the active reward -> start date general streak
      const startDateRewardStreak =
        new Date(startDateGeneralStreak).getTime() <
        new Date(activeReward.createdAt).getTime()
          ? activeReward.createdAt
          : startDateGeneralStreak;

      const reducibleArr = dayEntities
        .filter((d) => {
          // Equalize hours to make sure that same days match
          const createdDate = setDateTime(d.createdAt, 'middle');
          const startDate = setDateTime(startDateRewardStreak, 'middle');

          return createdDate >= startDate;
        })
        .map((day) => getDayAchievements(day).streak);

      const newValue = reducibleArr.length
        ? reducibleArr.reduce((prev, cur) => prev + cur) -
          // - start cycles in case you added a reward mid day with already achieved streaks
          activeReward.startCycles
        : 0;

      // set new reward value
      await rewards.updateOne(
        { _id: activeRewardId },
        {
          $set: {
            completedCycles:
              // make sure that cycles can't go over the max
              newValue > activeReward.totalCycles
                ? activeReward.totalCycles
                : newValue,
          },
        }
      );
    }

    return res.status(200).send({ message: 'streaks updated' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
