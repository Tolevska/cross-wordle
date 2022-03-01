// import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from "../../constants/settings";

export const Key = ({
  children,
  status,
  width = 45,
  value,
  onClick,
  isRevealing,
}) => {
  // const keyDelayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
  const keyDelayMs = 0;

  let backgroundColor;
  let borderColor;

  let classes =
    "flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none";

  if (isRevealing) {
    classes = classes.concat(" transition ease-in-out");
  }
  if (!status) {
    backgroundColor = `${"#e7e8ea"}`;
    borderColor = `${"#787c7e"}`;
  }
  if (status === "absent") {
    classes = classes.concat(" text-white");
    backgroundColor = `${"#787c7e"}`;
    borderColor = `${"#787c7e"}`;
  }
  if (status === "correct") {
    classes = classes.concat(" text-white");
    backgroundColor = `${"#6aaa64"}`;
    borderColor = `${"#6aaa64"}`;
  }
  if (status === "present") {
    classes = classes.concat(" text-white");
    backgroundColor = `${"#fdc038"}`;
    borderColor = `${"#fdc038"}`;
  }

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : "unset",
    width: `${width}px`,
    height: "58px",
    backgroundColor,
    borderColor,
  };

  const handleClick = (event) => {
    onClick(value);
    event.currentTarget.blur();
  };

  return (
    <button style={styles} className={classes} onClick={handleClick}>
      {children || value}
    </button>
  );
};
