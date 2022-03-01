import { Cell } from "./Cell";

export const EmptyRow = ({ columns }) => {
  const emptyCells = Array.from(Array(columns));

  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};
