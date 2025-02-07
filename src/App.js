import "./styles.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Header } from "./layouts/header";
import useLocalStorage from "./hooks/useLocalstorage";
import { useLayoutContext } from "./contexts/LayoutContext";

export default function App() {
  const { darkMode } = useLayoutContext();

  return (
    <Theme
      scaling="110%"
      appearance={darkMode ? "dark" : "light"}
      accentColor="green"
      grayColor="sand"
      radius="medium"
    >
      <Header></Header>
    </Theme>
  );
}
