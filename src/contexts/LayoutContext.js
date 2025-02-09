import { useState, useEffect, useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalstorage";
import useToggle from "../hooks/useToggle";

const layoutContext = createContext(null);

export const useLayoutContext = () => {
  return useContext(layoutContext);
};

export const LayoutContextProvider = (props) => {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", true);
  const [isSidebarOpen, toggleSidebar] = useToggle(false);
  const [chatId, setChatId] = useState("");
  const [otherUserDocId, setOtherUserDocId] = useState("");
  const [otherUserChatId, setOtherUserChatId] = useState("");

  return (
    <layoutContext.Provider
      value={{
        darkMode,
        setDarkMode,
        isSidebarOpen,
        toggleSidebar,
        chatId,
        setChatId,
        otherUserDocId,
        otherUserChatId,
        setOtherUserDocId,
        setOtherUserChatId,
      }}
    >
      {props.children}
    </layoutContext.Provider>
  );
};
