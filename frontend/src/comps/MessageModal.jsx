import React from "react";
import { useMessage } from "../context/messageContext";

function MessageModal() {
  const { setOpenMessageModal } = useMessage();

  const handleClose = () => {
    setOpenMessageModal(false);
  };

  return (
    <div className="p-3 bg-[#9131F6] w-full h-full text-white rounded-md border-2 border-[#101828] ">
      <h2>Message Modal</h2>
      <button className="absolute top-3  right-1" onClick={handleClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default MessageModal;
