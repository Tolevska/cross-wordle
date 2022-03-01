import {
  loadGameStateFromLocalStorage,
  loadMatrixFromLocalStorage,
  saveMatrixToLocalStorage,
} from "../utils/gameState";

export const getStatuses = (guesses, solution) => {
  const charObj = {};
  const splitSolution = solution.split("");

  guesses.forEach((word) => {
    word.split("").forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        return (charObj[letter] = "absent");
      }
      if (letter === splitSolution[i]) {
        return (charObj[letter] = "correct");
      }
      if (charObj[letter] !== "correct") {
        return (charObj[letter] = "present");
      }
    });
  });

  return charObj;
};

export const isLetterCorrect = (letter, indexOfLetterInWord, guesses) => {
  //tuka proveri dali bukvata e tocna pogodena vo nekoj od guesses
  let isCorrect = false;

  guesses?.forEach((guess) => {
    if (isCorrect) return;
    isCorrect = false;
    if (guess[indexOfLetterInWord] === letter) {
      console.log(letter, "=", guess[indexOfLetterInWord]);
      isCorrect = true;
    }
  });
  return isCorrect;
};

export const getUpdatedHomeScreenRowStatuses = (
  row,
  rowIndex,
  solutionWordsData
) => {
  const rowStatuses = row;
  const guesses = loadGameStateFromLocalStorage();

  solutionWordsData?.forEach((solutionWordData, index) => {
    const { word, rowNumber, colNumber, startIndex, isSolved } =
      solutionWordData;

    if (rowNumber !== null && rowNumber === rowIndex) {
      // ako zborot e horizontalen i e vo ovoj red
      for (let i = 0; i < word.length; i++) {
        const letterData = rowStatuses[startIndex + i];
        const indexOfLetterInWord = i;
        // tuka ima bukva
        if (isSolved) {
          //zborot e solved taka sto site bukvi od nego se pogodeni
          letterData.status = "correct";
        } else {
          // zborot ne e solved taka sto ne se site bukvi pogodeni
          const isLetterCorrectValue = isLetterCorrect(
            letterData.value,
            indexOfLetterInWord,
            guesses[index]
          );
          if (isLetterCorrectValue) {
            letterData.status = "absent";
          }
        }
      }
      return; //todo is this obsolete?
    } else if (
      colNumber !== null &&
      startIndex <= rowIndex &&
      startIndex + word.length - 1 >= rowIndex &&
      isSolved
    ) {
      // ako zborot e pogoden i e vertikalen i ima bukva vo ovoj red
      rowStatuses[colNumber].status = "correct";
    }
  });

  let dataFromLS = loadMatrixFromLocalStorage();
  if (dataFromLS) {
    dataFromLS[rowIndex] = rowStatuses;
    saveMatrixToLocalStorage(dataFromLS);
  } else {
    dataFromLS = Array.from(new Array(() => []));
    dataFromLS[rowIndex] = rowStatuses;
    saveMatrixToLocalStorage(dataFromLS);
  }

  return rowStatuses;
};

export const getGuessStatuses = (guess, solution) => {
  const splitSolution = solution.split("");
  const splitGuess = guess.split("");

  const solutionCharsTaken = splitSolution.map((_) => false);

  const statuses = Array.from(Array(guess.length));

  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = "correct";
      solutionCharsTaken[i] = true;
      return;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return;

    if (!splitSolution.includes(letter)) {
      statuses[i] = "absent";
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = "present";
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    } else {
      statuses[i] = "absent";
      return;
    }
  });
  return statuses;
};
