import { Cell } from "./Cell";

export const EmptyRow = ({ columns }) => {
  const emptyCells = Array.from(Array(columns));

  return (
    <>
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </>
  );
};
