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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const navigation = [
  {
    kind: "header",
    title: "Chats",
  },
  {
    segment: "direct-messages",
    title: "Direct Messages",
    shortTitle: "DMs",
    icon: <ChatBubbleOutlineIcon />,
  },
  {
    segment: "group-chats",
    title: "Group Chats",
    shortTitle: "Groups",
    icon: <GroupIcon />,
  },
  {
    separator: "true",
  },
  {
    kind: "header",
    title: "Settings",
  },
  {
    segment: "profile",
    title: "Profile",
    shortTitle: "Profile",
    icon: <AccountCircleIcon />,
  },
  {
    segment: "preferences",
    title: "Preferences",
    shortTitle: "Settings",
    icon: <SettingsIcon />,
  },
];

export const Sidebar = memo(() => {
  const { isSidebarOpen } = useLayoutContext();

  const className = isSidebarOpen
    ? "sidebar sidebar__open"
    : "sidebar sidebar__closed";

  return (
    <Box className={className}>
      <Grid p="2" gap="1">
        {navigation.map((section) => {
          if (section.hasOwnProperty("kind")) {
            return (
              <Text color="gray" size="1" mb="1">
                {section.title}
              </Text>
            );
          } else if (section.hasOwnProperty("separator")) {
            return (
              <Separator my="1" mt="2" size="4" orientation="horizontal" />
            );
          } else {
            return (
              <>
                <Button variant="outline" className="sidebar__section-item">
                  {section.icon}
                  <Text className="sidebar__section-item__text" size="2">
                    {section.title}
                  </Text>
                </Button>
              </>
            );
          }
        })}
      </Grid>
    </Box>
  );
});
