import { handleClickedWord } from "../../utils/helpers";
import { HomeScreenRow } from "./HomeScreenRow";

export const HomeScreenGrid = ({
  matrixPattern = null,
  setWordToGuess = () => {},
  dailyWordsData,
  hideEmptyCells = false,
  page,
}) => {
  return (
    <div>
      {matrixPattern &&
        matrixPattern.map((row, rowIndex) => {
          return (
            <HomeScreenRow
              row={row}
              rowIndex={rowIndex}
              isRevealing={true}
              key={rowIndex}
              dailyWordsData={dailyWordsData}
              hideEmptyCells={hideEmptyCells}
              page={page}
              onChooseWord={(colIndex) => {
                handleClickedWord(
                  rowIndex,
                  colIndex,
                  setWordToGuess,
                  dailyWordsData
                );
              }}
            />
          );
        })}
    </div>
  );
};
