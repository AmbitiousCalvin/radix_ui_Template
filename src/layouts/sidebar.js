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
} from "@radix-ui/themes";
import { useState, useRef, useEffect, memo } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import { useLayoutContext } from "../contexts/LayoutContext";
import "../styles/sidebar.scss";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

export const Sidebar = memo(() => {
  return (
    <Box maxWidth="250px" className="sidebar border-red">
      <Grid p="2" gap="2">
        <Flex
          p="2"
          align="center"
          gap="3"
          className="sidebar__section-container"
        >
          <IconButton variant="ghost">
            <WbSunnyIcon />
          </IconButton>
          <Text size="3">Manage your Budget</Text>
        </Flex>
      </Grid>
    </Box>
  );
});
