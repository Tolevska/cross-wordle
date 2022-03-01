import { StatBar } from "../stats/StatBar";
import { BaseModal } from "./BaseModal";
import { STATISTICS_TITLE } from "../../constants/strings";

export const StatsModal = ({ isOpen, handleClose, gameStats }) => {
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
    </BaseModal>
  );
};
