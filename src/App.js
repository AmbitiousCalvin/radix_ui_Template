import "./styles.scss";
import "@radix-ui/themes/styles.css";
import { Theme, Section, Box } from "@radix-ui/themes";
import { Header } from "./layouts/header";
import { Sidebar } from "./layouts/sidebar";
import { ContactList } from "./layouts/contactList";
import useLocalStorage from "./hooks/useLocalstorage";
import { useLayoutContext } from "./contexts/LayoutContext";

export default function App() {
  const { darkMode } = useLayoutContext();

  return (
    <Theme
      scaling="110%"
      appearance={darkMode ? "dark" : "light"}
      accentColor="iris"
      grayColor="sand"
      radius="medium"
    >
      <div className="App">
        <Header></Header>
        <Section p="0" className="main-content__section">
          <Sidebar></Sidebar>
          <div>
            <ContactList></ContactList>
          </div>
        </Section>

        <div className="overlay"></div>
      </div>
    </Theme>
  );
}
