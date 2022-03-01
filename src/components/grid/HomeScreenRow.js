import { Fragment, useEffect, useState } from "react";
import { getUpdatedHomeScreenRowStatuses } from "../../lib/statuses";
import { Cell } from "./Cell";

export const HomeScreenRow = ({
  row,
  rowIndex,
  isRevealing,
  onChooseWord,
  dailyWordsData,
  hideEmptyCells,
  page,
}) => {
  const [rowWithUpdatedStatuses, setRowWithUpdatedStatuses] = useState(row);
  const [isGameOver, setIsGameOver] = useState(() => {
    const didWin = localStorage.getItem("didWin");
    const didLose = localStorage.getItem("didLose");
    if (didWin || didLose) return true;
    return false;
  });

  useEffect(() => {
    setRowWithUpdatedStatuses(
      getUpdatedHomeScreenRowStatuses(row, rowIndex, dailyWordsData)
    );
  }, []);

  return (
    <div className="flex justify-center mb-1">
      {rowWithUpdatedStatuses?.map((obj, i) => {
        return (
          <Fragment key={i}>
            {obj?.value === "-" || obj?.status === "correct" || isGameOver ? (
              <Cell
                key={i}
                value={obj?.value}
                status={obj?.status}
                position={i}
                isRevealing={isRevealing}
                isCompleted
                borderStyle={obj?.value === "-" && hideEmptyCells ? "none" : ""}
                isGameOver={isGameOver}
              />
            ) : (
              <button onClick={() => onChooseWord(i)}>
                <Cell
                  key={i}
                  value={obj.value}
                  status={obj?.status}
                  position={i}
                  isRevealing={isRevealing}
                  isCompleted
                  page={page}
                />
              </button>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
