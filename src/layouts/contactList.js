import {
  Button,
  Flex,
  IconButton,
  Box,
  Text,
  Grid,
  Avatar,
  Theme,
  Skeleton,
  Popover,
} from "@radix-ui/themes";
import { useState, useEffect, memo } from "react";
import "../styles/contactList.scss";
import { useSnapshot } from "../hooks/useSnapshot";
import { usersRef, auth, db, chatsRef } from "../firebase";
import PersonIcon from "@mui/icons-material/Person"; // View Profile Icon
import ChatIcon from "@mui/icons-material/Chat"; // Start Chat Icon
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff"; // Mute Notifications Icon
import BlockIcon from "@mui/icons-material/Block"; // Block User Icon
import DeleteIcon from "@mui/icons-material/Delete"; // Delete Chat Icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Three-dots Menu Icon
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useContact } from "../contexts/ContactContext";
import { useAuthState } from "react-firebase-hooks/auth";

const dummyData = [{}, {}, {}, {}, {}];

export const ContactList = memo(() => {
  const [user] = useAuthState(auth);
  const [contacts, setContacts] = useState(dummyData);

  const { loading } = useSnapshot(usersRef, setContacts);

  useEffect(() => {
    console.log("contacts log: ", contacts);
  }, [contacts]);

  if (!user) return <h1>Loading...</h1>;

  return (
    <Theme accentColor="gray">
      <Box p="2" pl="0" className={"contact-list"}>
        <Grid gap="1">
          {contacts.map((contact) => {
            if (user.uid === contact.uid) return null;
            return (
              <ContactListItem
                key={contact.uid}
                contact={contact}
                isLoading={loading}
              />
            );
          })}
        </Grid>
      </Box>
    </Theme>
  );
});

const ContactListItem = memo(({ contact = {}, isLoading }) => {
  const { setContact } = useContact();

  return (
    <Skeleton loading={isLoading}>
      <Button
        variant="soft"
        className="contact-list__item"
        onClick={() => setContact(contact)}
      >
        <Avatar
          radius="full"
          size="2"
          src={contact.photoURL}
          fallback={contact.displayName?.charAt(0)}
          className="contact-list__item-avatar"
        />
        <Box className="contact-list__item__content">
          <Text as="div" size="2" className="contact-list__item-text">
            {contact.displayName}
          </Text>
          <Text as="div" className="contact-list__item-last-message" size="1">
            Last message djjjjjjjjjjjjjjj
          </Text>
        </Box>

        <MoreInfoIcon contact={contact} />
      </Button>
    </Skeleton>
  );
});

const MoreInfoIcon = ({ contact }) => {
  const [user] = useAuthState(auth);
  const { setContact } = useContact();

  const startChat = async (contact) => {
    try {
      setContact(contact);
      const generateChatId = (user1, user2) => {
        return [String(user1).toLowerCase(), String(user2).toLowerCase()]
          .sort((a, b) => a.localeCompare(b)) // Ensures proper sorting
          .join("_");
      };
      const chatId = generateChatId(user.uid, contact.uid);
      const chatRef = doc(chatsRef, chatId);
      const chatSnapshot = await getDoc(chatRef);

      if (!chatSnapshot.exists()) {
        await setDoc(chatRef, {
          user1: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          },
          user2: {
            displayName: contact.displayName,
            photoURL: contact.photoURL,
            email: contact.email,
          },
        });
        const messagesRef = collection(chatRef, "messages");
        await addDoc(messagesRef, {
          sender: "System",
          content: "Welcome to the chat!",
          createdAt: serverTimestamp(),
        });

        console.log("chat added with custom ID:", chatId);
      } else {
        console.log("chat already exists");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton
          size="1"
          variant="ghost"
          className="contact-list__item__icon"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content minWidth="200px">
        <Flex gap="1" direction="column">
          <Button
            variant="soft"
            size="2"
            className="contact-list__btn	"
            onClick={() => viewProfile(contact)}
          >
            <PersonIcon fontSize="small" />
            View Profile
          </Button>

          {/* Start Chat */}
          <Button
            variant="soft"
            size="2"
            className="contact-list__btn	"
            onClick={() => startChat(contact)}
          >
            <ChatIcon fontSize="small" />
            Start Chat (Add Contact Fn)
          </Button>

          {/* Mute Notifications */}
          <Button
            className="contact-list__btn	"
            variant="soft"
            size="2"
            onClick={() => toggleMute(contact)}
          >
            <NotificationsOffIcon fontSize="small" />
            {contact.muted ? "Unmute" : "Mute"} Notifications
          </Button>

          {/* Block User */}
          <Button
            className="contact-list__btn	"
            variant="soft"
            color="red"
            size="2"
            onClick={() => blockUser(contact)}
          >
            <BlockIcon fontSize="small" />
            Block User
          </Button>

          {/* Delete Chat */}
          <Button
            className="contact-list__btn	"
            variant="soft"
            color="red"
            size="2"
            onClick={() => deleteChat(contact)}
          >
            <DeleteIcon fontSize="small" />
            Delete Chat
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
