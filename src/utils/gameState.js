const gameStateKey = "gameState";
const gameStatKey = "gameStats";
const wordsDataKey = "wordsData";
const dateUpdatedKey = "latestUpdateOfWord";
const matrixKey = "matrix";

export const saveGameStateToLocalStorage = (gameState) => {
  // encoded data
  localStorage.setItem(gameStateKey, btoa(JSON.stringify(gameState)));
  // localStorage.setItem(gameStateKey, JSON.stringify(gameState));
};

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey);
  // encoded data
  return state ? JSON.parse(decodeURIComponent(atob(state))) : null;
  // return state ? JSON.parse(state) : null;
};

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, btoa(JSON.stringify(gameStats)));
  // localStorage.setItem(gameStatKey, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey);
  return stats ? JSON.parse(decodeURIComponent(atob(stats))) : null;
  // return stats ? JSON.parse(stats) : null;
};

export const saveWordsDataToLocalStorage = (data) => {
  // encoded data
  localStorage.setItem(wordsDataKey, btoa(JSON.stringify(data)));
  // localStorage.setItem(wordsDataKey, JSON.stringify(data));
};

export const loadWordsDataFromLocalStorage = () => {
  const data = localStorage.getItem(wordsDataKey);
  // encoded data
  return data ? JSON.parse(decodeURIComponent(atob(data))) : null;
  // return data ? JSON.parse(data) : null;
};

export const saveMatrixToLocalStorage = (data) => {
  localStorage.setItem(matrixKey, btoa(JSON.stringify(data)));
};

export const loadMatrixFromLocalStorage = () => {
  const data = localStorage.getItem(matrixKey);
  return data ? JSON.parse(decodeURIComponent(atob(data))) : null;
};

export const loadDateFromLocalStorage = () => {
  const data = localStorage.getItem(dateUpdatedKey);
  return data ? parseInt(data) : null;
};

export const saveDateToLocalStorage = (date) => {
  localStorage.setItem(dateUpdatedKey, date);
};
