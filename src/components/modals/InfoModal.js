import { BaseModal } from "./BaseModal";

export const InfoModal = ({ isOpen, handleClose }) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <img src="/icons/help-header.svg" className="mx-auto mt-8" />
      <hr className="mb-5" style={{ width: "70%" }} />
      <p className="text-xs">
        Crosswordly is the next iteration of the popular word guessing game.
        Instead of guessing one word, you’re challenged to solve an intersecting
        puzzle of 4 words.
      </p>

      <p className="text-xs mt-4 mb-5">Here’s how to play:</p>
      <hr />
      <p className="text-xs mt-5 mb-4">
        <span className="mr-1">
          <img
            src="/icons/circle-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        Tap the word in the crosswordly that you’d like to guess first.
      </p>
      <p className="text-xs mb-3">
        <span className="mr-1">
          <img
            src="/icons/circle-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        You have 6 guesses to solve for the word
      </p>
      <p className="text-xs mb-3">
        <span className="mr-1">
          <img
            src="/icons/circle-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        After each guess, the tiles with correct letters will turn a color:
      </p>
      <p className="text-xs mb-2">
        <span className="ml-4 mr-1">
          <img
            src="/icons/green-square-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        The letter is correct and in the correct place
      </p>
      <p className="text-xs mb-2">
        <span className="ml-4 mr-1">
          <img
            src="/icons/orange-square-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        The letter exists but is in the wrong place
      </p>
      <p className="text-xs mb-2">
        <span className="ml-4 mr-1">
          <img
            src="/icons/gray-square-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px" }}
          />
        </span>
        This letter does not exist
      </p>
      <p className="text-xs mb-3">
        <span className="mr-1">
          <img
            src="/icons/circle-icon.svg"
            className="h-3 inline"
            style={{ marginTop: "-1px", marginRight: "2px", marginLeft: "2px" }}
          />
        </span>
        Once you’ve guessed all four words, you’ve won!
      </p>

      <hr className="mt-4" />

      <p className="text-xs mt-4">
        Be careful, if you run out of guesses on any word, you lose the game!
      </p>
      <p className="mt-5 text-xs">
        A new crosswordly will be available each day!
      </p>
    </BaseModal>
  );
};
