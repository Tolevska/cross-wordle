import { MAX_CHALLENGES } from "../constants/settings";
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from "../utils/gameState";

export const addStatsForCompletedGame = (gameStats, count) => {
  const stats = { ...gameStats };

  stats.totalGames += 1;

  if (count >= MAX_CHALLENGES) {
    // A fail situation
    stats.currentStreak = 0;
    stats.gamesFailed += 1;
  } else {
    stats.currentStreak += 1;
    stats.gamesWon += 1;

    stats.bestTime = "00:00:00"; // TODO handle best time logic;

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
