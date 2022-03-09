import { useEffect, useState } from "react";
import Platform from "react-platform-js";
import { Grid } from "./components/grid/Grid";
import { Keyboard } from "./components/keyboard/Keyboard";
import { InfoModal } from "./components/modals/InfoModal";
import { StatsModal } from "./components/modals/StatsModal";
import { YouWonModal } from "./components/modals/YouWonModal";
import { YouLostModal } from "./components/modals/YouLostModal";
import {
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_ALREADY_GUESSED,
  WORD_NOT_FOUND_MESSAGE,
} from "./constants/strings";
import {
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from "./constants/settings";
import { isWordInWordList, isWinningWord, unicodeLength } from "./lib/words";
import { addStatsForCompletedGame, loadStats } from "./lib/stats";
import {
  loadGameStateFromLocalStorage,
  loadIsNewUser,
  loadWordsDataFromLocalStorage,
  saveGameStateToLocalStorage,
  saveIsNewUser,
} from "./utils/gameState";

import { AlertContainer } from "./components/alerts/AlertContainer";
import { useAlert } from "./context/AlertContext";
import Home from "./containers/Home";
import {
  didEndGame,
  didWinGame,
  getUpdatedDailyWordsData,
  getTimerData,
  getSolvedIndexesForWord,
} from "./utils/helpers";

function App() {
  const { showErrorAlert } = useAlert();

  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRowClass, setCurrentRowClass] = useState("");
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isWonModalOpen, setIsWonModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [stats, setStats] = useState(() => loadStats());
  const [time, setTime] = useState(0);
  const [solutionWord, setSolutionWord] = useState(null);
  const [solutionWordIndex, setSolutionWordIndex] = useState(null);
  const [solvedLetterIndexesOfChosenWord, setSolvedLetterIndexesOfChosenWord] =
    useState([]);

  const [dailyWords, setDailyWords] = useState(() =>
    loadWordsDataFromLocalStorage()
  );

  const [guesses, setGuesses] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    return loaded || Array.from(new Array(4), () => []);
  });

  useEffect(() => {
    saveGameStateToLocalStorage(guesses);
  }, [guesses]);

  const [clientScreenSize, setClientScreenSize] = useState({});

  const handleResize = () => {
    if (!document) return;

    let e = document.querySelector("#grid-wrapper");
    const height = e?.offsetParent?.clientHeight;
    const width = e?.offsetParent?.clientWidth;
    setClientScreenSize({ height, width });
    return;
  };

  useEffect(() => {
    handleResize();
  }, [showHomeScreen]);

  useEffect(() => {
    // if no game state on load, show the user the how-to info modal
    const isNewUser = loadIsNewUser();
    if (isNewUser) {
      saveIsNewUser(false);
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }

    if (localStorage.getItem("timeSpent")) {
      const time = parseInt(localStorage.getItem("timeSpent"));
      setTime(time);
    }

    const didWinCrossWordle = localStorage.getItem("didWin");
    if (didWinCrossWordle && didWinCrossWordle !== isWonModalOpen) {
      setIsWonModalOpen(true);
    }

    const didLoseCrossWordle = localStorage.getItem("didLose");
    if (didLoseCrossWordle && didLoseCrossWordle !== isLostModalOpen) {
      setIsLostModalOpen(true);
    }

    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  window.addEventListener("beforeunload", function (event) {
    const shouldClear = localStorage.setItem(
      "shouldClear",
      JSON.stringify(true)
    );
    if (shouldClear && JSON.parse(shouldClear)) {
      localStorage.clear();
    } else {
      localStorage.setItem("timeSpent", JSON.stringify(time));
    }
    return "";
  });

  useEffect(() => {
    // manage timer data
    let interval = null;
    if (!isGameLost && !isGameWon) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else if (!localStorage.getItem("timeSpent")) {
      localStorage.setItem("timeSpent", time);
      clearInterval(interval);
    }

    const isGameOver = didEndGame();

    const dailyWordsData = loadWordsDataFromLocalStorage();

    if (isGameWon) {
      const newData = getUpdatedDailyWordsData(dailyWordsData, solutionWord);
      if (!showHomeScreen) {
        setShowHomeScreen(true);
        const didWinCrossWordle = didWinGame();
        if (didWinCrossWordle) {
          localStorage.setItem("timeSpent", JSON.stringify(time));
          localStorage.setItem("finishedIn", JSON.stringify(time));
          setStats(addStatsForCompletedGame(stats, true, time));
          setDailyWords(newData);
          setIsWonModalOpen(true);
        }
        window.location.reload();
      }
    }

    if (isGameLost) {
      if (!showHomeScreen) {
        setShowHomeScreen(true);
        const didLoseCrossWordle = localStorage.getItem("didLose");
        if (didLoseCrossWordle) {
          localStorage.setItem("finishedIn", JSON.stringify(time));
          setStats(addStatsForCompletedGame(stats, false, time));
          setIsLostModalOpen(true);
        }
        window.location.reload();
      }
    }

    if (isGameOver) {
      clearInterval(interval);
      localStorage.removeItem("timeSpent");
    }

    return () => clearInterval(interval);
  }, [isGameLost, isGameWon]);

  const onChar = (value) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= (solutionWord?.length || 5) &&
      guesses[solutionWordIndex].length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      const letterIndex = currentGuess.length;
      let updatedGuess = currentGuess;
      if (
        solvedLetterIndexesOfChosenWord.includes(letterIndex) &&
        guesses[solutionWordIndex].length === 0
      ) {
        const solvedLetter = solutionWord[letterIndex];
        updatedGuess = updatedGuess.concat(solvedLetter);
      }
      updatedGuess = updatedGuess.concat(value);

      if (
        solvedLetterIndexesOfChosenWord.includes(letterIndex + 1) &&
        guesses[solutionWordIndex].length === 0 &&
        updatedGuess.length + 1 === solutionWord.length
      ) {
        updatedGuess = updatedGuess.concat(solutionWord[letterIndex + 1]);
      }

      setCurrentGuess(updatedGuess);
    }
  };

  const getSolvedLetters = () => {
    if (
      (guesses && !guesses[solutionWord]) ||
      (guesses && guesses[solutionWord] && guesses[solutionWord].length === 0)
    ) {
      const solvedLetters = [];

      solvedLetterIndexesOfChosenWord.forEach((index) =>
        solvedLetters.push(solutionWord[index])
      );
      return solvedLetters;
    }
    return [];
  };

  const onChosenWordToGuess = (chosenWord) => {
    setSolutionWord(chosenWord);
    const dailyWordsData = loadWordsDataFromLocalStorage();
    const wordIndex = dailyWordsData.findIndex(
      (word) => word.word === chosenWord
    );
    const solvedLettersIndexes = getSolvedIndexesForWord(
      dailyWords,
      guesses[wordIndex],
      chosenWord
    );

    setSolvedLetterIndexesOfChosenWord(solvedLettersIndexes);
    setSolutionWordIndex(wordIndex);
    setShowHomeScreen(false);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass("");
  };

  const onDelete = () => {
    let updatedCurrentGuess = currentGuess.split("");
    if (
      solvedLetterIndexesOfChosenWord.includes(currentGuess.length - 1) &&
      guesses[solutionWordIndex].length === 0
    ) {
      updatedCurrentGuess = updatedCurrentGuess.slice(0, -2).join("");
    } else {
      updatedCurrentGuess = updatedCurrentGuess.slice(0, -1).join("");
    }
    setCurrentGuess(updatedCurrentGuess);
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) return;
    // check if word is not long enough
    // const currentGuessLength = currentGuess.length;
    const currentGuessLength = unicodeLength(currentGuess);
    const solutionWordLength = solutionWord?.length;

    if (currentGuessLength !== solutionWordLength) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // check if word does not exist in db
    // if (!isWordInWordList(currentGuess.join(""))) {
    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    setIsRevealing(true);
    // turn this back off after all chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * (solutionWord?.length || 5));

    // do not allow duplicate guesses
    // if (guesses[solutionWordIndex].includes(currentGuess.join(""))) {
    if (guesses[solutionWordIndex].includes(currentGuess)) {
      return showErrorAlert(WORD_ALREADY_GUESSED, {
        onClose: clearCurrentRowClass,
      });
    }

    // const winningWord = isWinningWord(currentGuess.join(""), solutionWord);
    // guesses[solutionWordIndex].push(currentGuess.join(""));
    // setGuesses(guesses);
    // setCurrentGuess(new Array(5, () => null));

    const winningWord = isWinningWord(currentGuess, solutionWord);

    guesses[solutionWordIndex].push(currentGuess);
    setGuesses(guesses);
    setCurrentGuess("");

    saveGameStateToLocalStorage(guesses);

    if (
      // currentGuess.length === (solutionWord?.length || 5) && // if length of word is correct
      unicodeLength(currentGuess) === (solutionWord?.length || 5) && // if length of word is correct
      guesses[solutionWordIndex].length <= MAX_CHALLENGES && // if number of guesses <= 6
      !isGameWon // if user lost
    ) {
      if (winningWord) {
        const dailyWordsData = loadWordsDataFromLocalStorage();
        let noSolvedWords = 0;

        dailyWordsData.forEach((wordData) => {
          if (wordData.isSolved) {
            noSolvedWords++;
          }
        });

        if (noSolvedWords === 3) {
          localStorage.setItem("didWin", true);
        }
        return setIsGameWon(true);
      }

      if (guesses[solutionWordIndex].length === MAX_CHALLENGES) {
        localStorage.setItem("didLose", true);
        setIsGameLost(true);
      }
    }
  };

  return (
    <>
      <div className="navbar border-b-2 flex items-center justify-center h-20">
        {!showHomeScreen && (
          <button
            className="cursor-pointer absolute left-6"
            onClick={() => {
              setShowHomeScreen(true);
              window.location.reload();
            }}
          >
            <img src="/icons/x-icon.svg" />
          </button>
        )}
        <p className="text-lg font-semibold">CROSSWORDLY</p>
        <div className="absolute align-middle" style={{ right: "36px" }}>
          <button
            onClick={() => setIsInfoModalOpen((isOpen) => !isOpen)}
            style={{ marginRight: "30px" }}
          >
            <img src="/icons/help-icon.svg" />
          </button>
          <button onClick={() => setIsStatsModalOpen((isOpen) => !isOpen)}>
            <img src="/icons/stats-icon.svg" />
          </button>
        </div>
      </div>

      <div
        id="screen-wrapper"
        className="screen-wrapper-custom w-full sm:w-3/4 md:max-w-[500px] pt-2 pb-8 mx-auto sm:px-6 lg:px-8"
        style={{ maxHeight: Platform.OS === "iOS" ? "60vh" : "80vh" }}
      >
        <div className="flex items-center justify-center h-16 font-bold text-base">
          {getTimerData(time)}
        </div>
        <hr className="mb-7 mx-auto" />
        <div className="content-wrapper">
          {!showHomeScreen ? (
            <>
              <Grid
                guesses={guesses[solutionWordIndex]}
                currentGuess={currentGuess}
                currentRowClassName={currentRowClass}
                rows={6}
                columns={solutionWord?.length || 5}
                solution={solutionWord}
                custom={clientScreenSize}
                dailyWords={dailyWords}
                solvedCellIndexes={solvedLetterIndexesOfChosenWord}
              />
              <Keyboard
                onChar={onChar}
                onDelete={onDelete}
                onEnter={onEnter}
                guesses={guesses[solutionWordIndex]}
                solution={solutionWord}
                getSolvedLetters={getSolvedLetters}
              />
            </>
          ) : (
            <>
              <Home
                custom={clientScreenSize}
                setWordToGuess={onChosenWordToGuess}
              />
              {/* TODO: remove this before going in production */}
              <button
                onClick={() => {
                  localStorage.clear(); //TODO: do we need this?
                  localStorage.setItem("shouldClear", JSON.stringify(true));
                  window.location.reload();
                }}
                className="bg-orange-300 px-3 py-2"
              >
                Play again
              </button>
              <h3 className="mt-3">
                Solutions for today: (for testing purposes)
              </h3>
              {loadWordsDataFromLocalStorage() &&
                loadWordsDataFromLocalStorage().map((el, i) => {
                  return (
                    <pre key={i}>
                      <b>{el.word}</b>
                    </pre>
                  );
                })}
            </>
          )}
        </div>

        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <YouWonModal
          isOpen={isWonModalOpen}
          dailyWordsData={dailyWords}
          handleClose={() => setIsWonModalOpen(false)}
        />
        <YouLostModal
          isOpen={isLostModalOpen}
          handleClose={() => setIsLostModalOpen(false)}
        />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          gameStats={stats}
        />
        <AlertContainer />
      </div>
    </>
  );
}

export default App;
