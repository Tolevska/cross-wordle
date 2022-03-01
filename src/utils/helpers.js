import { WORD_PATTERNS } from "../data/solutionPattern";
import { isWordInWordList } from "../lib/words";
import {
  loadDateFromLocalStorage,
  loadMatrixFromLocalStorage,
  saveWordsDataToLocalStorage,
} from "./gameState";

export const getUpdatedDailyWordsData = (dailyWordsData, solution) => {
  // se povikuva od App.js koga kje se pogodi nekoj zbor
  if (!dailyWordsData || dailyWordsData.length === 0) return [];
  const updatedDailyWordsData = dailyWordsData;
  const wordIndex = updatedDailyWordsData.findIndex(
    (word) => word.word === solution
  );

  updatedDailyWordsData[wordIndex].isSolved = true;
  saveWordsDataToLocalStorage(updatedDailyWordsData);
  return updatedDailyWordsData;
};

export const handleClickedWord = (rowIndex, colIndex, onSuccess, words) => {
  let clickedWord = null;

  words.forEach((wordData) => {
    if (wordData.rowNumber !== null && wordData.rowNumber === rowIndex) {
      const condition1 = wordData.startIndex <= colIndex;
      const condition2 =
        colIndex <= wordData.startIndex + wordData.word.length - 1;

      if (condition1 && condition2) {
        clickedWord = wordData.word;
        return;
      }
    } else if (wordData.colNumber !== null && wordData.colNumber === colIndex) {
      const condition1 = wordData.startIndex <= rowIndex;
      const condition2 =
        rowIndex <= wordData.startIndex + wordData.word.length - 1;

      if (condition1 && condition2) {
        clickedWord = wordData.word;
        return;
      }
    }
  });

  onSuccess(clickedWord);
};

export const generateMatrix = (pattern) => {
  const rows = pattern.split("").length > 0 ? pattern.match(/.{6}/g) : null;
  let matrix = [];
  let tmp = [];

  let i, j;
  for (i = 0; i < 7; i++) {
    for (j = 0, tmp = []; j < 6; j++) {
      let charsInRow = rows[i].split("");
      if (charsInRow[j] === "-") {
        tmp.push({ value: charsInRow[j], status: "null" });
      } else {
        tmp.push({ value: charsInRow[j], status: "pending" });
      }
    }
    matrix.push(tmp);
  }
  return matrix;
};

export const getIndexOfWord = () => {
  const startDateInMs = new Date("2022-03-01").getTime(); // TODO: change date before going in production
  const dayInMs = 86400000; // a day in miliseconds
  const todayInMs = new Date().getTime();
  let newIndex = Math.ceil((todayInMs - startDateInMs) / dayInMs);
  debugger;
  return newIndex;
};

export const getGeneratedMatrixPattern = () => {
  const startDateInMs = new Date("2022-03-01").getTime(); // TODO: change date before going in production
  const dayInMs = 86400000; // a day in miliseconds
  const todayInMs = new Date().getTime();
  const latestUpdate = loadDateFromLocalStorage();
  let newIndex = Math.ceil((todayInMs - startDateInMs) / dayInMs);
  const previousPattern = loadMatrixFromLocalStorage();
  let pattern = "";

  if (previousPattern && latestUpdate) {
    const prevIndex = Math.ceil((latestUpdate - startDateInMs) / dayInMs);
    if (prevIndex < newIndex) {
      pattern = WORD_PATTERNS[newIndex];
    } else {
      return previousPattern;
    }
  } else {
    pattern = WORD_PATTERNS[newIndex];
  }

  return generateMatrix(pattern);
};

export const areDatesInSameDay = (date1, date2) => {
  const dateToCheck = new Date(date1);
  const actualDate = new Date(date2);
  return (
    dateToCheck.getDate() === actualDate.getDate() &&
    dateToCheck.getMonth() === actualDate.getMonth() &&
    dateToCheck.getFullYear() === actualDate.getFullYear()
  );
};

export const getDateFormatted = () => {
  const date = new Date();
  const text = date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const arr = text.split(" ");
  const day = arr[0];
  const month = arr[1].slice(0, 3);
  const year = arr[2];

  return `${month} ${day}, ${year}`;
};

export const getWordsData = (matrix) => {
  let words = [];
  let i, j;

  // rows
  for (i = 0; i < 7; i++) {
    let tmp = [];
    let wordStartIndex = null;

    for (j = 0; j < 6; j++) {
      const char = matrix[i][j].value;
      if (char && char !== "-") {
        tmp.push(char);
        if (wordStartIndex === null) {
          wordStartIndex = j;
        }
      }
      if ((char && char === "-") || j === 5) {
        if (tmp.length >= 4) {
          const word = tmp.join("");
          const isValid = isWordInWordList(word);
          if (isValid) {
            words.push({
              word: word,
              rowNumber: i,
              colNumber: null,
              startIndex: wordStartIndex,
              isSolved: false,
            });
            break;
          }
        } else {
          // TODO is this else obsolete?
          tmp = [];
          wordStartIndex = null;
        }
      }
    }
  }

  // columns
  for (i = 0; i < 6; i++) {
    let tmp = [];
    let wordStartIndex = null;

    for (j = 0, tmp = []; j < 7; j++) {
      const char = matrix[j][i].value;
      if (char && char !== "-") {
        tmp.push(char);
        if (wordStartIndex === null) {
          wordStartIndex = j;
        }
      }
      if ((char && char === "-") || j === 6) {
        if (tmp.length >= 4) {
          const word = tmp.join("");
          const isValid = isWordInWordList(word);

          if (isValid) {
            words.push({
              word: word,
              rowNumber: null,
              colNumber: i,
              startIndex: wordStartIndex,
              isSolved: false,
            });
            break;
          }
        } else {
          // TODO is this else obsolete?
          tmp = [];
          wordStartIndex = null;
        }
      }
    }
  }
  return words;
};

export const handleShare = () => {
  let matrix = loadMatrixFromLocalStorage();
  let tiles = ["🟩", "🟨", "⬛"];
  let pattern = "";

  const didWinCrossWordle = localStorage.getItem("didWin");
  if (didWinCrossWordle === "true") {
    pattern = getBeatCrosswordleTimeLabel();
    pattern = pattern.concat("\n\n");
  } else {
    pattern = `I lost Crosswordle #${getIndexOfWord()}\n`;
  }

  matrix.forEach((row) => {
    row.forEach((element) => {
      if (
        element.value === "-"
        //  || element.status === "pending" // ako ima bukva ama ne e pogodena
      ) {
        // ako nema bukva
        pattern = pattern.concat(tiles[2]);
      } else if (element.status === "correct") {
        // ako ima bukva i e pogodena i ako e pogoden cel zbor
        pattern = pattern.concat(tiles[0]);
      }
      // else if (
      //   element.status === "present" ||
      //   (element.status === "absent" && element.value !== "-") ||
      // )
      // ako ima bukva i e pogodena ama ne e pogoden cel zbor
      else {
        // ako ima bukva ama ne pogoden zborot
        pattern = pattern.concat(tiles[1]);
      }
    });
    pattern = pattern.concat("\n");
  });
  navigator.clipboard.writeText(pattern);
};

export const getTimeSpentLabel = () => {
  const timeSpent = getTimeSpent();
  if (timeSpent) {
    if (timeSpent.minutes === 0) {
      return `Solved in ${timeSpent.seconds} seconds!`;
    }
    return `Solved in ${timeSpent.minutes} minutes and ${timeSpent.seconds} seconds!`;
  } else return "";
};

export const getBeatCrosswordleTimeLabel = () => {
  const { minutes, seconds } = getTimeSpent();
  if (minutes === 0) {
    return `I beat Crosswordle ${"#1"} in ${seconds} seconds!`;
  }
  return `I beat Crosswordle ${"#1"} in ${minutes} minutes and ${seconds} seconds!`;
};

export const getTimeSpent = () => {
  if (localStorage.getItem("time")) {
    const time = localStorage.getItem("time");
    let minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    let seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2);

    if (minutes.split("")[0] === "0") {
      minutes = parseInt(minutes.split("")[1]);
    }
    if (seconds.split("")[0] === "0") {
      seconds = parseInt(seconds.split("")[1]);
    }
    return { minutes, seconds };
  }
};
