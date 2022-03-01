import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Countdown from "react-countdown";
import { tomorrow } from "../../lib/words";
import { SHARE_TEXT, TEXT_COPIED } from "../../constants/strings";
import { handleShare } from "../../utils/helpers";
import { useAlert } from "../../context/AlertContext";

export const GameOverModal = ({ children, isOpen, handleClose }) => {
  const { showErrorAlert } = useAlert();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto "
        onClose={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0 mt-14">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-2xl px-5 pt-6 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-lg sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute right-4 top-4">
                <button
                  className="cursor-pointer"
                  onClick={() => handleClose()}
                >
                  <img src="/icons/x-icon.svg" />
                </button>
              </div>
              <div className="mb-12">
                <div className="text-left px-4 pt-5 pb-4 sm:p-6">
                  <div className="mt-2">{children}</div>
                </div>
              </div>
              <div
                className="w-full grid grid-cols-2 absolute left-0 bottom-0"
                style={{ backgroundColor: "#6aaa64" }}
              >
                <div className="grid-row-2 flex flex-col items-center justify-center ">
                  <div className="text-gray-200 text-xs">Next crossword</div>
                  <div className="text-white">
                    <Countdown
                      className="text-md font-medium text-white-900 tracking-wide"
                      date={tomorrow}
                      daysInHours={true}
                    />
                  </div>
                </div>
                <div className="flex m-4">
                  <button
                    className="w-full"
                    style={{
                      borderRadius: "5px",
                      borderBottomRightRadius: "10px",
                      backgroundColor: "#ffba38",
                      height: "45px",
                    }}
                    onClick={() => {
                      handleShare();
                      return showErrorAlert(TEXT_COPIED, {
                        onClose: () => {},
                      });
                    }}
                  >
                    <p className="text-xs font-bold text-white">{SHARE_TEXT}</p>
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
