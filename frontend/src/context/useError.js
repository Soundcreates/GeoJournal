import { useContext } from "react";
import { ErrorContext } from "./ErrorContext.js";

export function useError() {
  const content = useContext(ErrorContext);
  return content;
}