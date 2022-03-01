// import { REVEAL_TIME_MS } from "../../constants/settings";

export const Cell = (props) => {
  const {
    value,
    status,
    isRevealing,
    isCompleted,
    position = 0,
    page = "wordle",
    isGameOver = false,
  } = props;
  const isFilled = value && !isCompleted;
  const shouldReveal = isRevealing && isCompleted;
  // const animationDelay = `${position * REVEAL_TIME_MS}ms`;
  const border = `${props.borderStyle}`;

  let backgroundColor;
  let borderColor;

  let classes =
    "w-16 h-16 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded";

  if (!status) {
    classes = classes.concat(" bg-white border-slate-200 ");
  }
  if (value && !status) {
    classes = classes.concat(" border-black ");
  }
  if (isFilled) {
    // classes = classes.concat(" cell-fill-animation");
  }
  if (shouldReveal) {
    // classes = classes.concat(" cell-reveal");
  }

  const setAbsentStyle = () => {
    // temno siva
    classes = classes.concat(" absent text-white");
    backgroundColor = `${"#787c7e"}`;
    borderColor = `${"#787c7e"}`;
  };
  const setCorrectStyle = () => {
    // zelena
    classes = classes.concat(" correct text-white");
    backgroundColor = `${"#6aaa64"}`;
    borderColor = `${"#6aaa64"}`;
  };
  const setPresentStyle = () => {
    // zolta
    classes = classes.concat(" present text-white");
    backgroundColor = `${"#fdc038"}`;
    borderColor = `${"#fdc038"}`;
  };
  const setPendingStyle = () => {
    // svetlo siva
    classes = classes.concat("");
    backgroundColor = `${"rgba(211, 214, 218, 0.5019607843137255)"}`;
    borderColor = `${"rgba(211, 214, 218, 0.5019607843137255)"}`;
  };

  //
  if (status === "absent") {
    setAbsentStyle();
  } else if (status === "correct") {
    //dobro vo site slucai
    setCorrectStyle();
  } else if (status === "present") {
    setPresentStyle();
  } else if (status === "pending") {
    setPendingStyle();
  }

  if (!isGameOver) {
    if (status === "absent" && page === "homeScreen") {
      setPendingStyle();
    }
  } else {
    if (status === "absent" || status === "pending") {
      setAbsentStyle();
    }
  }

  return (
    <div
      className={classes}
      style={{
        backgroundColor,
        borderColor,
        border,
        // animationDelay
      }}
    >
      <div
        className="letter-container mt-3"
        // style={{ animationDelay }}
      >
        {value === "-"
          ? ""
          : !isGameOver
          ? status === "pending" ||
            (status === "absent" && page === "homeScreen")
            ? ""
            : value
          : value}
      </div>
    </div>
  );
};
