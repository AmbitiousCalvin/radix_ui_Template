import {
  Button,
  Section,
  Flex,
  IconButton,
  Heading,
  TextField,
  Container,
  Box,
  Text,
  Grid,
  Separator,
} from "@radix-ui/themes";
import { useState, useRef, useEffect, memo } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import { useLayoutContext } from "../contexts/LayoutContext";
import "../styles/sidebar.scss";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description";

const navigation = [
  {
    kind: "header",
    title: "Chats",
  },
  {
    segment: "direct-messages",
    title: "Direct Messages",
    icon: <ChatIcon />,
  },
  {
    segment: "group-chats",
    title: "Group Chats",
    icon: <PeopleIcon />,
  },
  {
    kind: "header",
    title: "Settings",
  },
  {
    segment: "profile",
    title: "Profile",
    icon: <DescriptionIcon />,
  },
  {
    segment: "preferences",
    title: "Preferences",
    icon: <SettingsIcon />,
  },
];

export const Sidebar = memo(() => {
  const { isSidebarOpen } = useLayoutContext();

  return (
    <Box
      maxWidth="250px"
      className="sidebar"
      display={isSidebarOpen ? "initial" : "none"}
    >
      <Grid p="2" gap="1">
        {navigation.map((section) => {
          if (section.hasOwnProperty("kind")) {
            return (
              <Text color="gray" size="2">
                {section.title}
              </Text>
            );
          } else {
            return (
              <Button variant="outline" className="sidebar_section-item">
                {section.icon}
                <Text size="2">{section.title}</Text>
              </Button>
            );
          }
        })}
      </Grid>
    </Box>
  );
});
