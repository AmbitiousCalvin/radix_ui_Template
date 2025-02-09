import React, { createContext, useState, useContext } from "react";

const ContactContext = createContext();

export const useContact = () => useContext(ContactContext);

export const ContactContextProvider = ({ children }) => {
  const [contact, setContact] = useState(null);

  return (
    <ContactContext.Provider value={{ contact, setContact }}>
      {children}
    </ContactContext.Provider>
  );
};
