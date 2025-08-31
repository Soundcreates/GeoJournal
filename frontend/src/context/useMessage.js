import { useContext } from "react";
import { MessageContext } from "./MessageContext.js";

export function useMessage() {
  const content = useContext(MessageContext);
  return content;
}