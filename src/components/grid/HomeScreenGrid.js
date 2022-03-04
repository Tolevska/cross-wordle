import { handleClickedWord } from "../../utils/helpers";
import { HomeScreenRow } from "./HomeScreenRow";

export const HomeScreenGrid = ({
  matrixPattern = null,
  setWordToGuess = () => {},
  dailyWordsData,
  hideEmptyCells = false,
  page,
  custom,
  isModal = false,
}) => {
  const columns = matrixPattern[0]?.length;
  let customStyle = {};

  if (!isModal) {
    let customSize = 0;
    let { height, width } = custom;
    height = height - 80 - 70; // 80 e navbar 70 e timer
    customSize = height <= width ? height : width;
    customStyle = {
      height: `${customSize}px`,
      width: `${customSize - 30}px`,
    };
  } else {
    customStyle = {
      height: "80vw",
    };
  }

  return (
    <div
      className={"grid-wrapper-custom"}
      id="grid-wrapper"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        ...customStyle,
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
