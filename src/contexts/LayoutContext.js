import { useState, useEffect, useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalstorage";

const layoutContext = createContext(null);

export const useLayoutContext = () => {
  return useContext(layoutContext);
};

export const LayoutContextProvider = (props) => {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", true);

  return (
    <layoutContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {props.children}
    </layoutContext.Provider>
  );
};
