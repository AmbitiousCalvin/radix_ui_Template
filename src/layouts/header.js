import {
  Button,
  Section,
  Flex,
  IconButton,
  Heading,
  TextField,
} from "@radix-ui/themes";
import { useState, useRef, useEffect, memo } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchIcon from "@mui/icons-material/Search";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import useLocalstorage from "../hooks/useLocalstorage";
import "../styles/header.scss";
import { useLayoutContext } from "../contexts/LayoutContext";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle, usersRef } from "../firebase";
import { query, where, getDocs, addDoc } from "firebase/firestore";

export const Header = memo(() => {
  return (
    <Section p="3" className="header " width="100%">
      <Flex gap="3">
        <SidebarMenuButton />

        <Flex gap="1" align="center" className="logo-container">
          <DynamicFormIcon fontSize="large" />
          <Heading>GoDash</Heading>
        </Flex>

        <Section p="2" style={{ flex: 1 }} className=""></Section>

        <TextField.Root placeholder="Search the docs…">
          <TextField.Slot>
            <IconButton variant="ghost" radius="full">
              {" "}
              <SearchIcon />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>

        <SignInButton />
        <ThemeButton />
      </Flex>
    </Section>
  );
});

const SidebarMenuButton = () => {
  const { isSidebarOpen, toggleSidebar } = useLayoutContext();

  return (
    <IconButton variant="solid" onClick={toggleSidebar}>
      {!isSidebarOpen && <MenuIcon />}
      {isSidebarOpen && <MenuOpenIcon />}
    </IconButton>
  );
};

const ThemeButton = () => {
  const { darkMode, setDarkMode } = useLayoutContext();

  return (
    <IconButton variant="solid" onClick={() => setDarkMode((prev) => !prev)}>
      {darkMode && <WbSunnyIcon />}
      {!darkMode && <NightlightIcon />}
    </IconButton>
  );
};

const SignInButton = () => {
  const [user] = useAuthState(auth);

  const addUserIfNotExists = async ({ userId, userData }) => {
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("no user ike this one");
      await addDoc(usersRef, { uid: userId, ...userData });
    }
  };

  useEffect(() => {
    if (user) {
      addUserIfNotExists({
        userId: user.uid,
        userData: {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        },
      });
    }
  }, [user]);

  return <Button onClick={signInWithGoogle}>Sign in</Button>;
};
