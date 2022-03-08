import { useState } from "react";
import { getGuessStatuses } from "../../lib/statuses";
import { Cell } from "./Cell";

export const CompletedRow = ({ guess, isRevealing, solution }) => {
  const [statuses, setStatuses] = useState(() => {
    return getGuessStatuses(guess, solution);
  });
  const splitGuess = guess.split("");

  return (
    <>
      {splitGuess &&
        splitGuess.map((letter, i) => (
          <Cell
            key={i}
            value={letter}
            status={statuses[i]}
            position={i}
            isRevealing={isRevealing}
            isCompleted
          />
        ))}
    </>
  );
};
