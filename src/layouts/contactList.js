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
  Card,
  Avatar,
  Theme,
  Separator,
  Skeleton,
} from "@radix-ui/themes";
import { useState, useRef, useEffect, memo } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import { useLayoutContext } from "../contexts/LayoutContext";
import "../styles/contactList.scss";
import { useSnapshot } from "../hooks/useSnapshot";
import { usersRef } from "../firebase";
import SettingsIcon from "@mui/icons-material/Settings";

const dummyData = [{}, {}, {}, {}, {}];

export const ContactList = memo(() => {
  const [contacts, setContacts] = useState(dummyData);

  const { loading } = useSnapshot(usersRef, setContacts);

  useEffect(() => {
    console.log("contacts log: ", contacts);
  }, [contacts]);

  return (
    <Theme accentColor="gray">
      <Box py="2" className={"contact-list border-red"}>
        <Grid gap="1">
          {contacts.map((user) => {
            return (
              <ContactListItem key={user.uid} user={user} isLoading={loading} />
            );
          })}
        </Grid>
      </Box>
    </Theme>
  );
});

const ContactListItem = memo(({ user = {}, isLoading }) => {
  return (
    <Skeleton loading={isLoading}>
      <Button variant="soft" className="contact-list__item">
        <Avatar
          radius="full"
          size="2"
          src={user.photoURL}
          fallback={user.displayName?.charAt(0)}
          className="contact-list__item-avatar"
        />
        <Box className="contact-list__item__content">
          <Text as="div" size="2" className="contact-list__item-text">
            {user.displayName}
          </Text>
          <Text as="div" size="1">
            Last message
          </Text>
        </Box>
      </Button>
    </Skeleton>
  );
});
