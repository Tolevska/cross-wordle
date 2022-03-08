import Platform from "react-platform-js";
import { CompletedRow } from "./CompletedRow";
import { CurrentRow } from "./CurrentRow";
import { EmptyRow } from "./EmptyRow";

export const Grid = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  rows,
  columns = 5,
  solution,
  custom,
  dailyWords,
  // onChar = () => {},
}) => {
  const empties =
    guesses.length < rows - 1
      ? Array.from(Array(rows - 1 - guesses.length))
      : [];

  let { height, width } = custom;

  height = height - 80 - 70 - 180 - 20; // 80 e navbar 70 e timer 180 e keyboard 20 margin pod grid
  if (Platform.OS === "iOS") {
    height = height - 90;
  }
  const customSize = height <= width ? height : width;

  const finalHeight = customSize;
  let finalWidth = customSize;

  if (columns === 4) {
    finalWidth = finalWidth - 94;
  } else if (columns === 5) {
    finalWidth = finalWidth - 54;
  } else if (columns === 6) {
    finalWidth = finalWidth + 14;
  }

  return (
    <div
      className={"grid-wrapper-custom"}
      id="grid-wrapper"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        height: `${finalHeight}px`,
        width: `${finalWidth}px`,
      }}
    >
      {guesses &&
        guesses.map((guess, i) => {
          return (
            <CompletedRow
              key={i}
              guess={guess}
              isRevealing={isRevealing && guesses.length - 1 === i}
              solution={solution}
            />
          );
        })}
      {guesses && guesses.length < rows && (
        // tuka da se prati info za statusot i vrednosta na cell-ot
        <CurrentRow
          guess={currentGuess}
          className={currentRowClassName}
          columns={columns}
          guesses={guesses}
          dailyWords={dailyWords}
          solution={solution}
          // onChar={onChar}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} columns={columns} />
      ))}
    </div>
  );
};
