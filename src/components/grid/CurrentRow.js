import { Cell } from "./Cell";

export const CurrentRow = ({
  guess = [],
  columns,
  solvedCellIndexes,
  solution,
  guesses,
}) => {
  const splitGuess = guess.split("");
  const noCells = Array.from(Array(columns));

  return (
    <>
      {noCells.map((_, i) => {
        if (solvedCellIndexes.includes(i) && guesses.length === 0) {
          return <Cell key={i} value={solution[i]} isSolvedLetter={true} />;
        } else if (splitGuess && splitGuess[i]) {
          return <Cell key={i} value={splitGuess[i]} />;
        } else {
          return <Cell key={i} />;
        }
      })}
    </>
  );
};
