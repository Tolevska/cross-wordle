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
}) => {
  const empties =
    guesses.length < rows - 1
      ? Array.from(Array(rows - 1 - guesses.length))
      : [];

  return (
    <div className="pb-6">
      {guesses.map((guess, i) => {
        return (
          <CompletedRow
            key={i}
            guess={guess}
            isRevealing={isRevealing && guesses.length - 1 === i}
            solution={solution}
          />
        );
      })}
      {guesses.length < rows && (
        <CurrentRow
          guess={currentGuess}
          className={currentRowClassName}
          columns={columns}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} columns={columns} />
      ))}
    </div>
  );
};
