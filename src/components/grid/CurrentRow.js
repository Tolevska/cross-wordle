import { Cell } from "./Cell";

export const CurrentRow = ({
  guess = [],
  className,
  columns,
  dailyWords,
  solution,
  guesses = [],
  onChar,
}) => {
  // const splitGuess = guess;
  // console.log(guess);
  const splitGuess = guess.split("");
  const emptyCells = Array.from(Array(columns - splitGuess.length));

  // const solvedIndexes = [];

  // if (dailyWords && guesses.length === 0) {
  //   const solvedWordsData = dailyWords.filter((word) => word.isSolved === true);

  //   if (solvedWordsData && solvedWordsData.length > 0) {
  //     const selectedWordData = dailyWords.find(
  //       (word) => word.word === solution
  //     );
  //     const selectedWordDirection = selectedWordData.rowNumber ? "row" : "col";

  //     const solvedWordsWithDifferentDirection = solvedWordsData.filter(
  //       (word) => {
  //         const wordDirection = word.rowNumber ? "row" : "col";
  //         return wordDirection !== selectedWordDirection;
  //       }
  //     );

  //     if (
  //       solvedWordsWithDifferentDirection &&
  //       solvedWordsWithDifferentDirection.length > 0
  //     ) {
  //       solvedWordsWithDifferentDirection.forEach((solvedWordData) => {
  //         // rowNumber ili colNumber; // startIndex
  //         const solvedWordDirection = solvedWordData.rowNumber ? "row" : "col";
  //         if (solvedWordDirection === "row") {
  //           // nasiot e vertikalen; pogodenite se horizontalni
  //           if (
  //             selectedWordData.colNumber >= solvedWordData.startIndex &&
  //             selectedWordData.colNumber <=
  //               solvedWordData.startIndex + selectedWordData.word.length
  //           ) {
  //             solvedIndexes.push(
  //               solvedWordData.rowNumber - selectedWordData.startIndex
  //             );
  //             // solved letters gi sodrzi bukvite kade sto se secat
  //           } else {
  //             console.log("ne se secat");
  //             // ne se secat
  //           }
  //         } else {
  //           // nasiot zbor e horizontalen; pogodenite se vertikalni
  //           if (
  //             selectedWordData.rowNumber >= solvedWordData.startIndex &&
  //             selectedWordData.rowNumber <=
  //               solvedWordData.startIndex + selectedWordData.word.length
  //           ) {
  //             solvedIndexes.push(
  //               solvedWordData.colNumber - selectedWordData.startIndex
  //             );
  //             // solved letters gi sodrzi bukvite kade sto se secat
  //           } else {
  //             console.log("ne se secat");
  //             // ne se secat
  //           }
  //         }
  //       });
  //     }
  //   }
  // }

  // if (solvedIndexes && solvedIndexes.length > 0) {
  //   solution.split("").forEach((letterInSolution, letterIndex) => {
  //     if (solvedIndexes.includes(letterIndex)) {
  //       onChar(letterInSolution, letterIndex);
  //       // splitGuess[letterIndex] = letterInSolution;
  //     } else {
  //       // debugger;
  //       // if (splitGuess[letterIndex] !== null) splitGuess[letterIndex] = null;
  //     }
  //   });
  // }

  // const numberOfEmptyCells =
  //   splitGuess.length > 0
  //     ? columns - splitGuess.filter((el) => el !== null).length
  //     : columns - splitGuess.length;

  // const emptyCells = Array.from(Array(numberOfEmptyCells));

  return (
    <>
      {splitGuess &&
        splitGuess.map((letter, i) => {
          // if (letter) {
          return (
            <Cell
              key={i}
              // value={letter || null}
              value={letter}
              // isSolvedLetter={solvedIndexes.includes(i)}
            />
          );
          // } else {
          //   return <Cell key={i} />;
          // }
        })}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </>
  );
};
