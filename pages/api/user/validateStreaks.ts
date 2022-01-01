import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

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
          { $set: { completedCycles: 0 } }
        );

      return res.status(200).send('Reset streaks');
    };

    // helper func that gets amount of achieved streaks
    const getAchievedStreaks = (day: DayEntity) => {
      if (!day.activities.length) return 0;
      const total = day.activities
        .map((a) => a.count)
        .reduce((prev, cur) => prev + cur);

      const goal = day.dailyGoal;
      const streaks = Math.floor(total / goal);

      return streaks;
    };

    const days = await getCollection<DayEntity>('days');

    // get yesterday
    const yesterdayDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const start = new Date(yesterdayDate.setUTCHours(0, 0, 0, 0));
    const end = new Date(yesterdayDate.setUTCHours(23, 59, 59, 999));

    const yesterday = await days.findOne({
      userId,
      createdAt: { $gte: start, $lt: end },
    });

    // If there is no entry from yesterday reset the streak
    if (!yesterday) return await reset();

    // If daily goal wasn't achieved, reset the streak
    if (!getAchievedStreaks(yesterday)) return await reset();

    //
    // * Now it's clear that there is a streak, so we need to calculate it. *
    //

    // Get all days
    const dayEntities = await days.find({ userId }).toArray();

    // First date after a gap is found in the day entities
    let firstDateAfterGap;

    // Check if there are any gaps in between dates;
    for (let i = 0; i < dayEntities.length; i++) {
      const day1 = dayEntities?.[i];
      const day2 = dayEntities?.[i + 1];
      const date1 = day1?.createdAt;
      const date2 = day2?.createdAt;

      if (date2 && date1) {
        // To calculate the no. of days between two dates
        const differenceInDays = Math.floor(
          (new Date(date2).getTime() - new Date(date1).getTime()) /
            (1000 * 3600 * 24)
        );

        // if diff is > 1, you have missing days, this means that the streak is invalid so you should pick the day available
        if (differenceInDays > 1) {
          // Check if date2 hit it's goal
          if (getAchievedStreaks(day2)) firstDateAfterGap = date2;
        }
      }
    }

    // The first day entity post
    const firstDate = new Date(dayEntities?.[0]?.createdAt);

    // get index of item that did not achieve goal
    const indexOfDateThatDidNotAchieveGoal = dayEntities
      .reverse()
      .findIndex((d) => !getAchievedStreaks(d));

    // get date of the item after that index item. (-1 because the array is reversed)
    const dateThatDidNotAchieveGoal =
      dayEntities.reverse()[indexOfDateThatDidNotAchieveGoal - 1]?.createdAt;

    // all possible dates of first item
    const dates = [firstDate, dateThatDidNotAchieveGoal, firstDateAfterGap];

    //  sort all dates and grab the most recent one
    const startDateGeneralStreak =
      dates.sort(
        (a, b) => (!a || !b ? 0 : new Date(b).getTime() - new Date(a).getTime())
        // if no dates exist yet, grab current date
      )[0] || new Date();

    // day entities that are used for calculating the general streak
    const generalStreakDays = dayEntities.filter((d) => {
      // Equalize hours to make sure that same days match
      const createdDate = new Date(d.createdAt).setUTCHours(12, 0, 0, 0);
      const startDate = new Date(startDateGeneralStreak).setUTCHours(
        12,
        0,
        0,
        0
      );

      return createdDate >= startDate;
    });

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

      const newValue = dayEntities
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
        .map((day) => getAchievedStreaks(day))
        .reduce((prev, cur) => prev + cur);

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

    return res.status(200).send(undefined);
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
