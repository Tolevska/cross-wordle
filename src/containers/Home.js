import React, { useEffect, useState } from "react";
import { HomeScreenGrid } from "../components/grid/HomeScreenGrid";
import {
  getGeneratedMatrixPattern,
  getWordsData,
  areDatesInSameDay,
} from "../utils/helpers";
import {
  loadWordsDataFromLocalStorage,
  saveWordsDataToLocalStorage,
  loadDateFromLocalStorage,
  saveDateToLocalStorage,
  saveGameStateToLocalStorage,
} from "../utils/gameState";

const Home = ({ setWordToGuess, custom }) => {
  const todayInMs = new Date().getTime();

  const [matrixPattern, setMatrixPattern] = useState(() => {
    return getGeneratedMatrixPattern();
  });

  const [latestUpdateOfWord, setLatestUpdateOfWord] = useState(() => {
    const loadLatestUpdate = loadDateFromLocalStorage();
    if (loadLatestUpdate) {
      return loadLatestUpdate;
    } else {
      saveDateToLocalStorage(todayInMs);
      return todayInMs;
    }
  });

  const [wordsData, setWordsData] = useState(() => {
    const loadedData = loadWordsDataFromLocalStorage();
    const loadLatestUpdate = loadDateFromLocalStorage();
    const isSameDay = areDatesInSameDay(
      parseInt(loadLatestUpdate),
      todayInMs - 4567
    );

    if (loadedData && isSameDay) {
      // const test = new Date().getTime() - dayInMs;
      // const tmp = test > todayInMs;
      return loadedData;
    } else {
      setLatestUpdateOfWord(todayInMs);
      saveGameStateToLocalStorage(Array.from(new Array(() => [])));
      return getWordsData(matrixPattern);
    }
  });

  useEffect(() => {
    saveWordsDataToLocalStorage(wordsData);
  }, []);

  return (
    <HomeScreenGrid
      matrixPattern={matrixPattern}
      setWordToGuess={setWordToGuess}
      dailyWordsData={wordsData}
      custom={custom}
      page="homeScreen"
    />
  );
};

export default Home;
