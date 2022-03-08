import { allWords } from "../constants/allowedWords";

export const isWordInWordList = (word) => {
  return allWords.includes(word);
};

export const isWinningWord = (word, solution) => {
  // TODO: maybe move these in helpers file
  return solution === word;
};

export const unicodeLength = (word) => {
  return word.split("").length;
};

export const localeAwareLowerCase = (text) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase();
};

export const localeAwareUpperCase = (text) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase();
};

export const getWordOfDay = () => {
  // January 1, 2022 Game Epoch
  const epochMs = new Date("January 1, 2022 00:00:00").valueOf();
  const now = Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);
  const nextday = index * msInDay + epochMs + 3600000; //plus one hour to make it UTC0

  return {
    tomorrow: nextday,
  };
};

export const { tomorrow } = getWordOfDay();
