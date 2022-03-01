import {
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_TIME,
  WINS,
  LOSES,
} from "../../constants/strings";

const StatItem = ({
  label,
  value,
  customIconClass,
  customWrapperClass,
  imgSrc,
}) => {
  return (
    <div className={`items-center justify-center ${customWrapperClass || ""}`}>
      <div className="text-3xl font-bold grid-cols-2 flex">
        <div>
          <img src={imgSrc} className={`${customIconClass} mr-3`} />
        </div>
        <div>{value}</div>
      </div>
      <div className="text-xs text-gray-500 ml-10">{label}</div>
    </div>
  );
};

export const StatBar = ({ gameStats }) => {
  return (
    <div className="flex justify-center my-2">
      <div className="grid grid-cols-2 gap-0 w-full divide-x-2 mt-2">
        <div>
          <div className="grid grid-rows-2 gap-0 divide-y-2 h-full mr-3">
            <StatItem
              label={WINS}
              value={gameStats.gamesWon}
              customWrapperClass="flex flex-col"
              imgSrc={"/icons/win-icon.svg"}
            />
            <StatItem
              label={LOSES}
              value={gameStats.gamesFailed}
              customWrapperClass="flex flex-col"
              imgSrc={"/icons/lose-icon.svg"}
            />
          </div>
        </div>
        <div>
          <div className="grid grid-rows-3 divide-y-2 ml-3 gap-y-3">
            <StatItem
              label={SUCCESS_RATE_TEXT}
              value={gameStats.successRate}
              customIconClass="mt-2"
              imgSrc={"/icons/win-perc-icon.svg"}
            />
            <StatItem
              label={CURRENT_STREAK_TEXT}
              value={gameStats.currentStreak}
              customWrapperClass="pt-2.5 -mt-1.5"
              customIconClass="mt-2"
              imgSrc={"/icons/streak-icon.svg"}
            />
            <StatItem
              label={BEST_TIME}
              value={gameStats.bestTime}
              customWrapperClass="pt-2"
              customIconClass="mt-2"
              imgSrc={"/icons/time-icon.svg"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
