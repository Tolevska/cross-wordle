const gameStateKey = "gameState";
const gameStatKey = "gameStats";
const wordsDataKey = "wordsData";
const dateUpdatedKey = "latestUpdateOfWord";
const matrixKey = "matrix";
const isNewUserKey = "isNewUser";

export const saveGameStateToLocalStorage = (gameState) => {
  localStorage.setItem(gameStateKey, btoa(JSON.stringify(gameState)));
};

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey);
  return state ? JSON.parse(decodeURIComponent(atob(state))) : null;
};

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, btoa(JSON.stringify(gameStats)));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey);
  return stats ? JSON.parse(decodeURIComponent(atob(stats))) : null;
};

export const saveWordsDataToLocalStorage = (data) => {
  localStorage.setItem(wordsDataKey, btoa(JSON.stringify(data)));
};

export const loadWordsDataFromLocalStorage = () => {
  const data = localStorage.getItem(wordsDataKey);
  return data ? JSON.parse(decodeURIComponent(atob(data))) : null;
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

export const loadIsNewUser = () => {
  const data = localStorage.getItem(isNewUserKey);
  return data ? JSON.parse(data) : true;
};

export const saveIsNewUser = (isNewUser = false) => {
  localStorage.setItem(isNewUserKey, JSON.stringify(isNewUser));
};
