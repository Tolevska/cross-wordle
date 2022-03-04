import { GameOverModal } from "./GameOverModal";
import { Dialog } from "@headlessui/react";
import {
  getDateFormatted,
  getGeneratedMatrixPattern,
  getIndexOfWord,
  getTimeSpentLabel,
} from "../../utils/helpers";
import { HomeScreenGrid } from "../grid/HomeScreenGrid";
import { loadWordsDataFromLocalStorage } from "../../utils/gameState";
import { useState } from "react";

export const YouWonModal = ({ isOpen, handleClose }) => {
  const [dailyWordsData, setDailyWordsData] = useState(() => {
    return loadWordsDataFromLocalStorage();
  });

  const [matrixPattern, setMatrixPattern] = useState(() => {
    return getGeneratedMatrixPattern();
  });

  return (
    <GameOverModal title="You lost" isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col items-center">
        <img
          src="/icons/won-icon.svg"
          className="w-20 flex flex-row items-center align-middle content-center"
        />
        <Dialog.Title
          as="h1"
          className="text-2xl leading-6 font-medium text-gray-900 mt-5"
        >
          You've Won!
        </Dialog.Title>

        <p className="text-xs mt-1 text-gray-600">{getTimeSpentLabel()}</p>
        <p className="text-xs mt-4 text-black">
          <b>Crosswordle #{getIndexOfWord()}</b>
        </p>
        <p className="text-xs text-gray-500">{getDateFormatted()}</p>
        <hr className="w-full mt-4 mb-3" />
        <div className="w-screen">
          <div
            className="content-wrapper"
            style={{
              maxWidth: "80vw",
              margin: "0 auto",
            }}
          >
            {/* <HomeScreenGrid
              matrixPattern={matrixPattern}
              currentRowClassName={""}
              dailyWordsData={dailyWordsData}
              hideEmptyCells={true}
            /> */}
          </div>
        </div>
      </div>
    </GameOverModal>
  );
};
