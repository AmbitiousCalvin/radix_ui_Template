import { useState, useEffect, useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalstorage";
import useToggle from "../hooks/useToggle";

const layoutContext = createContext(null);

export const useLayoutContext = () => {
  return useContext(layoutContext);
};

export const LayoutContextProvider = (props) => {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", true);
  const [isSidebarOpen, toggleSidebar] = useToggle(true);

  return (
    <layoutContext.Provider
      value={{
        darkMode,
        setDarkMode,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {props.children}
    </layoutContext.Provider>
  );
};
