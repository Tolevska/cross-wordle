export const Cell = (props) => {
  const { value, status, page = "wordle", isGameOver = false, key } = props;
  const border = `${props.borderStyle}`;

  let backgroundColor;
  let borderColor;

  let classes =
    "custom-cell border-solid border-2 flex items-center justify-center text-4xl font-bold rounded";

  if (!status) {
    classes = classes.concat(" bg-white border-slate-200");
  }
  if (value && !status) {
    classes = classes.concat(" border-black");
  }

  const setAbsentStyle = () => {
    classes = classes.concat(" absent text-white");
    backgroundColor = `${"#787c7e"}`;
    borderColor = `${"#787c7e"}`;
  };
  const setCorrectStyle = () => {
    classes = classes.concat(" correct text-white");
    backgroundColor = `${"#6aaa64"}`;
    borderColor = `${"#6aaa64"}`;
  };
  const setPresentStyle = () => {
    classes = classes.concat(" present text-white");
    backgroundColor = `${"#fdc038"}`;
    borderColor = `${"#fdc038"}`;
  };
  const setPendingStyle = () => {
    classes = classes.concat("");
    backgroundColor = `${"rgba(211, 214, 218, 0.5019607843137255)"}`;
    borderColor = `${"rgba(211, 214, 218, 0.5019607843137255)"}`;
  };

  if (status === "absent") {
    setAbsentStyle();
  } else if (status === "correct") {
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
        position: "relative",
      }}
    >
      {props?.onChooseWord ? (
        <button
          onClick={() => props.onChooseWord(props.position)}
          className="w-full h-full"
        >
          <div className="letter-container">
            {value === "-"
              ? ""
              : !isGameOver
              ? status === "pending" ||
                (status === "absent" && page === "homeScreen")
                ? ""
                : value
              : value}
          </div>
        </button>
      ) : (
        <div className="letter-container">
          {value === "-"
            ? ""
            : !isGameOver
            ? status === "pending" ||
              (status === "absent" && page === "homeScreen")
              ? ""
              : value
            : value}
        </div>
      )}
    </div>
  );
};
