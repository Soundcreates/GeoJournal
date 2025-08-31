import React, { useState } from "react";
import { ErrorContext } from "./ErrorContext.js";

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
