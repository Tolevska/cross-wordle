import { MAX_CHALLENGES } from "../constants/settings";
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from "../utils/gameState";
import { getTimeSpent } from "../utils/helpers";

export const addStatsForCompletedGame = (gameStats, didWin) => {
  const timeSpent = getTimeSpent();

  const stats = { ...gameStats };

  stats.totalGames += 1;

  if (!didWin) {
    // A fail situation
    stats.currentStreak = 0;
    stats.gamesFailed += 1;
  } else {
    stats.currentStreak += 1;
    stats.gamesWon += 1;

    const minutes =
      timeSpent.minutes < 10 ? `0${timeSpent.minutes}` : `${timeSpent.minutes}`;
    const seconds =
      timeSpent.seconds < 10 ? `0${timeSpent.minutes}` : `${timeSpent.seconds}`;
    let tmp = "00:";
    tmp = tmp.concat(minutes).concat(":").concat(seconds);

    stats.bestTime = tmp;

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  }

  stats.successRate = getSuccessRate(stats);
  saveStatsToLocalStorage(stats);
  return stats;
};

const defaultStats = {
  gamesFailed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
  bestTime: "00:00:00",
};

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats;
};

const getSuccessRate = (gameStats) => {
  const { totalGames, gamesFailed } = gameStats;

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  );
};
