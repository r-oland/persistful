import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getAchievedStreaks } from 'utils/getAchievedStreaks';
import { getDifferenceInDays } from 'utils/getDifferenceInDays';
import { getCollection } from 'utils/getMongo';
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
        $gte: new Date(yesterdayDate.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(yesterdayDate.setUTCHours(23, 59, 59, 999)),
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
          $gte: new Date(dayBeforeYesterdayDate.setUTCHours(0, 0, 0, 0)),
          $lt: new Date(dayBeforeYesterdayDate.setUTCHours(23, 59, 59, 999)),
        },
      });

      // If there is no entry from yesterday or the day before that reset the streak
      if (!yesterday && !dayBeforeYesterday) return await reset();

      // If daily goals weren't achieved, reset the streak
      if (
        !getAchievedStreaks(yesterday) &&
        !getAchievedStreaks(dayBeforeYesterday)
      )
        return await reset();
    } else {
      // If there is no entry from yesterday reset the streak
      if (!yesterday) return await reset();

      // If daily goal wasn't achieved, reset the streak
      if (!getAchievedStreaks(yesterday)) return await reset();
    }

    //
    // * Now it's clear that there is a streak, so we need to calculate it. *
    //

    // Get all days except for today
    const dayEntitiesGetter = await days.find({ userId }).toArray();
    const dayEntities = dayEntitiesGetter.filter(
      (d, i) => i !== dayEntitiesGetter.length - 1
    );

    // First date after a gap is found in the day entities
    let firstDateAfterGap;
    let secondChangeUsed;

    // Check if there are any gaps in between dates;
    for (let i = 0; i < dayEntities.length; i++) {
      const day1 = dayEntities?.[i];
      const day2 = dayEntities?.[i + 1];
      const date1 = day1?.createdAt;
      // if day2 doesn't exist we can assume it's the current date (because we filtered it earlier)
      const date2 = day2?.createdAt || new Date();

      if (date2 && date1) {
        const differenceInDays = getDifferenceInDays(date1, date2);

        // if diff is > 1, you have missing days, this means that the streak is invalid so you should pick the day available
        if (differenceInDays > 1) {
          // if there is a difference of 2 and second change mode is on, check if this can be ignored
          if (differenceInDays === 2 && (day2 || day1)?.rules.secondChange) {
            // Check if there was a second change used in the last 7 days, if there wasn't set new second change date
            if (
              secondChangeUsed &&
              getDifferenceInDays(secondChangeUsed, date1) >= 7
            )
              secondChangeUsed = date1;

            // if second change was already used and the week isn't over, set first date after gap
            if (
              secondChangeUsed &&
              getDifferenceInDays(secondChangeUsed, date1) !== 0 &&
              getDifferenceInDays(secondChangeUsed, date1) < 7
            )
              firstDateAfterGap = date2;

            // If second change is not used yet, use it
            if (!secondChangeUsed) secondChangeUsed = date1;
            //  there is a gap, grab the next available & valid day as first day
          } else if (getAchievedStreaks(day2)) firstDateAfterGap = date2;
        }
      }
    }

    // The first day entity post
    const firstDate = new Date(dayEntities?.[0]?.createdAt);

    // get index of item that did not achieve goal in order from newest to latest
    const DescendingDayEntities = sortOnCreatedAt(dayEntities, 'desc');
    const indexOfDateThatDidNotAchieveGoal = DescendingDayEntities.findIndex(
      (d) => !getAchievedStreaks(d)
    );

    // get date of the item after that index item. (-1 because the array is reversed)
    const dateThatDidNotAchieveGoal =
      DescendingDayEntities[indexOfDateThatDidNotAchieveGoal - 1]?.createdAt;

    // all possible dates of first item
    const dates = [firstDate, dateThatDidNotAchieveGoal, firstDateAfterGap];

    //  sort all dates and grab the most recent one
    const startDateGeneralStreak =
      dates.sort(
        (a, b) => (!a || !b ? 0 : new Date(b).getTime() - new Date(a).getTime())
        // if no dates exist yet, grab current date
      )[0] || new Date();

    // day entities that are used for calculating the general streak
    const generalStreakDays = sortOnCreatedAt(dayEntities, 'asc').filter(
      (d) => {
        // Equalize hours to make sure that same days match
        const createdDate = new Date(d.createdAt).setUTCHours(12, 0, 0, 0);
        const startDate = new Date(startDateGeneralStreak).setUTCHours(
          12,
          0,
          0,
          0
        );

        return createdDate >= startDate;
      }
    );

    // generate array for bulk write
    let totalStreaks = 0;

    const bulkArray = generalStreakDays.map((day) => {
      const sum = getAchievedStreaks(day);
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
      .map((day) => getAchievedStreaks(day))
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

      const reducibleArr = sortOnCreatedAt(dayEntities, 'asc')
        .filter((d) => {
          // Equalize hours to make sure that same days match
          const createdDate = new Date(d.createdAt).setUTCHours(12, 0, 0, 0);
          const startDate = new Date(startDateRewardStreak).setUTCHours(
            12,
            0,
            0,
            0
          );

          return createdDate >= startDate;
        })
        .map((day) => getAchievedStreaks(day));

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

    return res.status(200).send({ messsage: 'streaks updated' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
