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
import useLocalstorage from "../hooks/useLocalstorage";
import "../styles/header.scss";
import { useLayoutContext } from "../contexts/LayoutContext";

export const Header = memo(() => {
  const { darkMode, setDarkMode } = useLayoutContext();

  return (
    <Section p="3" className="header " width="100%">
      <Flex gap="3">
        <IconButton variant="solid">
          <MenuIcon />
        </IconButton>

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

        <Button>Sign in</Button>

        <IconButton
          variant="solid"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode && <WbSunnyIcon />}
          {!darkMode && <NightlightIcon />}
        </IconButton>
      </Flex>
    </Section>
  );
});
