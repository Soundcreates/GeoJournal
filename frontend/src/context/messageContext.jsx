import React, { useState, useContext, createContext } from "react";

export const MessageContext = createContext();

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

export const useMessage = () => {
  let content = useContext(MessageContext);
  return content;
};
