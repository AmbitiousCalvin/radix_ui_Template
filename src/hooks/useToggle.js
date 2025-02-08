import { useState } from "react";

export default function useToggle(initialValue) {
  const [value, setValue] = useState(initialValue);

  function toggleValue(value) {
    setValue((prev) => (typeof value === "boolean" ? value : !prev));
  }

  return [value, toggleValue];
}
