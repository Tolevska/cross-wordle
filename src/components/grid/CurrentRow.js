import { Cell } from "./Cell";

export const CurrentRow = ({ guess, className, columns }) => {
  const splitGuess = guess.split("");
  const emptyCells = Array.from(Array(columns - splitGuess.length));

  return (
    <>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </>
  );
};
