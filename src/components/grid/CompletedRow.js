import { getGuessStatuses } from "../../lib/statuses";
import { Cell } from "./Cell";

export const CompletedRow = ({ guess, isRevealing, solution }) => {
  const statuses = getGuessStatuses(guess, solution);
  const splitGuess = guess.split("");

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  );
};
