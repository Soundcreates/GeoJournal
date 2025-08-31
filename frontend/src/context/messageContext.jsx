import React, { useState } from "react";
import { MessageContext } from "./MessageContext.js";

export function MessageProvider({ children }) {
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  let value = {
    openMessageModal,
    setOpenMessageModal,
    targetUser,
    setTargetUser,
  };
  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
