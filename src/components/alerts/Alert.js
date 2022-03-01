import { Fragment } from "react";
import { Transition } from "@headlessui/react";

export const Alert = ({ isOpen, message, variant = "error" }) => {
  let classes =
    "fixed z-20 left-1/2 transform -translate-x-1/2 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden text-white";

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300 transition"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-10000"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={classes}
        style={{ backgroundColor: "#5d719e", top: "90px" }}
      >
        <div className="p-4">
          <p className="text-sm text-center font-medium">{message}</p>
        </div>
      </div>
    </Transition>
  );
};
