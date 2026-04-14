const User = require("../models/User");

const DAY_MS = 24 * 60 * 60 * 1000;

const getStartOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const trackUserStreakActivity = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const todayStart = getStartOfDay(now);

  if (!user.lastStreakDate) {
    user.streakCount = 1;
    user.lastStreakDate = todayStart;
    user.lastActivityAt = now;
    await user.save();
    return;
  }

  const lastStreakStart = getStartOfDay(user.lastStreakDate);
  const diffDays = Math.floor((todayStart.getTime() - lastStreakStart.getTime()) / DAY_MS);

  if (diffDays > 0) {
    const currentStreak = Number(user.streakCount) || 0;
    const missedDays = Math.max(0, diffDays - 1);
    const decayedStreak = Math.max(0, currentStreak - missedDays);

    user.streakCount = decayedStreak + 1;
    user.lastStreakDate = todayStart;
  }

  user.lastActivityAt = now;
  await user.save();
};

module.exports = {
  trackUserStreakActivity,
  DAY_MS
};
