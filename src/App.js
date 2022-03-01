import { useEffect, useState } from "react";
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
  GAME_LOST_INFO_DELAY,
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
import { getUpdatedDailyWordsData } from "./utils/helpers";

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

  const [guesses, setGuesses] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    //todo improve logic

    // const gameWasWon = loaded?.guesses.includes(solutionWord);
    // if (gameWasWon) {
    //   setIsGameWon(true);
    // }
    // if (loaded && loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
    //   setIsGameLost(true);
    // }
    return loaded || Array.from(new Array(4), () => []);
  });

  useEffect(() => {
    saveGameStateToLocalStorage(guesses);
  }, [guesses]);

  useEffect(() => {
    const dailyWordsData = loadWordsDataFromLocalStorage();

    if (isGameWon) {
      getUpdatedDailyWordsData(dailyWordsData, solutionWord);
      // setTimeout(() => {
      if (!showHomeScreen) {
        setShowHomeScreen(true);
        const didWinCrossWordle = localStorage.getItem("didWin");
        if (didWinCrossWordle === "true") {
          setIsWonModalOpen(true);
        }
        window.location.reload();
      }
      // }, REVEAL_TIME_MS * (solutionWord?.length || 5));
    }

    if (isGameLost) {
      if (!showHomeScreen) {
        setShowHomeScreen(true);
        const didLoseCrossWordle = localStorage.getItem("didLose");
        if (didLoseCrossWordle === "true") {
          setIsLostModalOpen(true);
        }
        window.location.reload();
      }
    }
  }, [isGameWon, isGameLost]);

  // ============================================

  useEffect(() => {
    // if no game state on load, show the user the how-to info modal
    const isNewUser = loadIsNewUser();
    if (isNewUser) {
      saveIsNewUser(false);
      setTimeout(() => {
        setIsInfoModalOpen(true); // TODO: should I keep this logic?
      }, WELCOME_INFO_MODAL_MS);
    }

    // if (localStorage.getItem("time")) {
    //   setTime(parseInt(localStorage.getItem("time")));
    // }

    const didWinCrossWordle = localStorage.getItem("didWin");
    if (didWinCrossWordle && didWinCrossWordle !== isWonModalOpen) {
      setIsWonModalOpen(true);
    }

    const didLoseCrossWordle = localStorage.getItem("didLose");
    if (didLoseCrossWordle && didLoseCrossWordle !== isLostModalOpen) {
      setIsLostModalOpen(true);
    }
  }, []);

  useEffect(() => {
    // useEffect to manage timer data
    let interval = null;

    if (!isGameLost && !isGameWon) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else if (!localStorage.getItem("time")) {
      localStorage.setItem("time", time);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isGameLost, isGameWon]);

  const onChar = (value) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= (solutionWord?.length || 5) &&
      guesses[solutionWordIndex].length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onChosenWordToGuess = (chosenWord) => {
    setSolutionWord(chosenWord);

    const dailyWordsData = loadWordsDataFromLocalStorage();
    const wordIndex = dailyWordsData.findIndex(
      (word) => word.word === chosenWord
    );

    setSolutionWordIndex(wordIndex);
    setShowHomeScreen(false);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass("");
  };

  const onDelete = () => {
    const updatedCurrentGuess = currentGuess.split("").slice(0, -1).join("");
    setCurrentGuess(updatedCurrentGuess);
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) return;

    // check if word is not long enough
    const currentGuessLength = unicodeLength(currentGuess);
    const solutionWordLength = solutionWord?.length;

    if (currentGuessLength !== solutionWordLength) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // check if word does not exist in db
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

    const winningWord = isWinningWord(currentGuess, solutionWord);

    // TODO: condition to not allow duplicate guesses
    if (guesses[solutionWordIndex].includes(currentGuess)) {
      return showErrorAlert(WORD_ALREADY_GUESSED, {
        onClose: clearCurrentRowClass,
      });
    }

    guesses[solutionWordIndex].push(currentGuess);
    setGuesses(guesses);
    setCurrentGuess("");

    saveGameStateToLocalStorage(guesses);

    if (
      unicodeLength(currentGuess) === (solutionWord?.length || 5) && // ako e ok dolzinata na zborot
      guesses[solutionWordIndex].length <= MAX_CHALLENGES && // ako brojot na pogoduvanja e <= 6
      !isGameWon // ako ne sme pobedile
    ) {
      if (winningWord) {
        //TODO check logic for stats

        const dailyWordsData = loadWordsDataFromLocalStorage();
        let noSolvedWords = 0;

        dailyWordsData.forEach((wordData) => {
          if (wordData.isSolved) {
            noSolvedWords++;
          }
        });

        if (noSolvedWords === 3) {
          localStorage.setItem("didWin", true);
          setStats(
            addStatsForCompletedGame(stats, guesses[solutionWordIndex].length)
          );
        }
        return setIsGameWon(true);
      }

      if (guesses[solutionWordIndex].length === MAX_CHALLENGES) {
        //TODO check logic for stats
        setStats(
          addStatsForCompletedGame(stats, guesses[solutionWordIndex].length + 1)
        );
        localStorage.setItem("didLose", true);
        setIsGameLost(true);
      }
    }
  };

  const getTimerData = () => {
    const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2) + ":";
    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2) + ":";
    const miliseconds = ("0" + ((time / 10) % 1000)).slice(-2);

    // const miliseconds = "0" + Math.floor((time % 1000) / 100);
    // const seconds = "0" + Math.floor((time / 1000) % 60);
    // const minutes = "0" + Math.floor((time / (1000 * 60)) % 60);

    return minutes + seconds + miliseconds;
  };

  return (
    <>
      <div className="border-b-2 flex items-center justify-center h-20">
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
        <p className="text-lg font-semibold">CROSSWORDLE</p>
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

      <div className="pt-2 pb-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 font-bold text-base">
          T I M E R{/* {getTimerData()} */}
        </div>
        <hr className="mb-7 w-96 mx-auto" />
        {!showHomeScreen ? (
          <>
            <Grid
              guesses={guesses[solutionWordIndex]}
              currentGuess={currentGuess}
              // isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
              rows={6}
              columns={solutionWord?.length || 5}
              solution={solutionWord}
            />
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              guesses={guesses[solutionWordIndex]}
              // isRevealing={isRevealing}
              solution={solutionWord}
            />
          </>
        ) : (
          <Home setWordToGuess={onChosenWordToGuess} />
        )}
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <YouWonModal
          isOpen={isWonModalOpen}
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

        {/* TODO: remove this before going in production */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-orange-300 px-3 py-2"
        >
          Play again
        </button>
        <h3 className="mt-3">Solutions for today: (for testing purposes)</h3>
        {loadWordsDataFromLocalStorage() &&
          loadWordsDataFromLocalStorage().map((el, i) => {
            return (
              <pre key={i}>
                <b>{el.word}</b>
              </pre>
            );
          })}
      </div>
    </>
  );
}

export default App;
