import { differenceInDays, differenceInHours } from 'date-fns';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';
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
      await users.updateOne({ _id }, { $set: { streak: 0 } });
      if (activeReward)
        await rewards.updateOne(
          { _id: activeRewardId },
          { $set: { completedCycles: 0, startCycles: 0 } }
        );

      return res.status(200).send({ message: 'Streaks reset' });
    };

    const days = await getCollection<DayEntity>('days');

    // get yesterday
    const yesterdayDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const yesterday = await days.findOne({
      userId,
      createdAt: {
        $gte: setDateTime(yesterdayDate, 'start'),
        $lt: setDateTime(yesterdayDate, 'end'),
      },
    });

    if (yesterday?.rules.secondChange) {
      // get day before yesterday
      const dayBeforeYesterdayDate = new Date(
        new Date().getTime() - 48 * 60 * 60 * 1000
      );
      const dayBeforeYesterday = await days.findOne({
        userId,
        createdAt: {
          $gte: setDateTime(dayBeforeYesterdayDate, 'start'),
          $lt: setDateTime(dayBeforeYesterdayDate, 'end'),
        },
      });

      // If there is no entry from yesterday and the day before that reset the streak
      if (!yesterday && !dayBeforeYesterday) return await reset();

      // If daily goals weren't achieved, reset the streak
      if (
        !getDayAchievements(yesterday).streak &&
        !getDayAchievements(dayBeforeYesterday).streak
      )
        return await reset();
    } else {
      // If there is no entry from yesterday reset the streak
      if (!yesterday) return await reset();

      // If daily goal wasn't achieved, reset the streak
      if (!getDayAchievements(yesterday).streak) return await reset();
    }

    //
    // * Now it's clear that there is a streak, so we need to calculate it. *
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

    // The first day entity post
    const firstDate = new Date(dayEntities?.[0]?.createdAt);

    // array of new dates that will be stored in user object
    let secondChanceDates: Date[] = [];

    // get index of item that did not achieve goal
    const indexOfDateThatDidNotAchieveGoal = descendingDayEntities.findIndex(
      (d, i) => {
        const noStreak = !getDayAchievements(d).streak;

        // The first entity where the streak wasn't achieved
        if (!d?.rules.secondChange) return noStreak;

        /* 
          handle second change 
        */

        // the day has a streak so it can be ignored
        if (!noStreak) return false;

        const dayBeforeNoStreakDay = descendingDayEntities[i + 1];

        const date1 = setDateTime(d.createdAt, 'middle');
        const date2 = setDateTime(dayBeforeNoStreakDay?.createdAt, 'middle');

        if (!date2 || !date1) return false;

        const hourDifference = differenceInHours(date1, date2);

        // Day has no streak and the day before it also has no streak
        if (hourDifference > 24) return false;

        // Check if date was used in the secondChanceDates array
        const dateAlreadyHadASecondChange = !!secondChanceDates?.find(
          (date) =>
            date.toLocaleDateString() === d.createdAt.toLocaleDateString()
        );

        // Day used a second change in the past
        if (dateAlreadyHadASecondChange) return false;

        const secondChanceWasUsedLastWeek = secondChanceDates.length
          ? !!secondChanceDates.find(
              (scd) => differenceInDays(scd, d.createdAt) < 7
            )
          : // No second change dates have been used at all
            false;

        // Day before no streak day has a streak and can use secondChange
        if (!secondChanceWasUsedLastWeek) {
          // add new secondChange entity to array
          secondChanceDates = [...secondChanceDates, d.createdAt];

          // second change is used for this date -> it can be skipped
          return false;
        }

        // No conditions met -> Day has no streak and could not use a second change
        return true;
      }
    );

    const dateAfterDateThatDidNotAchieveGoal =
      descendingDayEntities[indexOfDateThatDidNotAchieveGoal - 1]?.createdAt;

    // all possible dates of first item
    const dates = [firstDate, dateAfterDateThatDidNotAchieveGoal];

    //  sort all dates and grab the most recent one
    const startDateGeneralStreak =
      dates.sort(
        (a, b) => (!a || !b ? 0 : new Date(b).getTime() - new Date(a).getTime())
        // if no dates exist yet, grab current date
      )[0] || new Date();

    // day entities that are used for calculating the general streak
    const generalStreakDays = dayEntities.filter((d) => {
      // Equalize hours to make sure that same days match
      const createdDate = setDateTime(d.createdAt, 'middle');
      const startDate = setDateTime(startDateGeneralStreak, 'middle');

      return createdDate >= startDate;
    });

    // generate array for bulk write
    let totalStreaks = 0;

    const bulkArray = generalStreakDays.map((day) => {
      const sum = getDayAchievements(day).streak;
      totalStreaks = sum + totalStreaks;

      return {
        updateOne: {
          filter: {
            _id: day._id,
          },
          update: {
            $set: {
              streakCount: totalStreaks,
            },
          },
        },
      };
    });

    // add streakCount to each day for history persistance
    await days.bulkWrite(bulkArray);

    // total sum of all completed streak day cycles
    const total = generalStreakDays
      .map((day) => getDayAchievements(day).streak)
      .reduce((prev, cur) => prev + cur);

    // update streak in user model
    await users.updateOne({ _id }, { $set: { streak: total } });

    if (activeReward && startDateGeneralStreak) {
      // if genreal streak if going on for longer then the reward streak -> activeReward.created_at
      // if genreal streak is later then the active reward -> start date general streak
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
