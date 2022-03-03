import { handleClickedWord } from "../../utils/helpers";
import { HomeScreenRow } from "./HomeScreenRow";

export const HomeScreenGrid = ({
  matrixPattern = null,
  setWordToGuess = () => {},
  dailyWordsData,
  hideEmptyCells = false,
  page,
}) => {
  const columns = matrixPattern[0]?.length;

  return (
    <div
      className={"grid-wrapper-custom pb-6"}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: "400px",
        height: "55vh",
      }}
    >
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
