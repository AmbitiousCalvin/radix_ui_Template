import { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  const savedVale = JSON.parse(localStorage.getItem(key));
  if (savedVale) return savedVale;

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useLocalstorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
