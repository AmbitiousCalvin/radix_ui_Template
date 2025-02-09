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
  Popover,
  Inset,
} from "@radix-ui/themes";
import { useState, useRef, useEffect, memo } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import "../styles/contactList.scss";
import { useSnapshot } from "../hooks/useSnapshot";
import { usersRef, auth, db } from "../firebase";
import PersonIcon from "@mui/icons-material/Person"; // View Profile Icon
import ChatIcon from "@mui/icons-material/Chat"; // Start Chat Icon
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff"; // Mute Notifications Icon
import BlockIcon from "@mui/icons-material/Block"; // Block User Icon
import DeleteIcon from "@mui/icons-material/Delete"; // Delete Chat Icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Three-dots Menu Icon
import SettingsIcon from "@mui/icons-material/Settings"; // Settings Icon
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useLayoutContext } from "../contexts/LayoutContext";
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
  return (
    <Skeleton loading={isLoading}>
      <Button variant="soft" className="contact-list__item">
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
  const { setChatId, setOtherUserDocId, setOtherUserChatId } =
    useLayoutContext();

  const getUserDocId = async (user) => {
    // Query the "users" collection to find the document where "uid" matches
    const userQuery = query(usersRef, where("uid", "==", user.uid));

    try {
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) return console.error("User document not found!");

      const userDoc = querySnapshot.docs[0]; // Get the first matching document
      return userDoc.id; // Return the document ID
    } catch (error) {
      console.error("Error fetching user document:", error);
    }
  };

  const startChat = async (contact) => {
    const userDocId = await getUserDocId(user); // Get the document ID of the user
    if (!userDocId) return;
    const contactsRef = collection(db, "users", userDocId, "contacts");
    const contactQuery = query(contactsRef, where("uid", "==", contact.uid));

    const otherUserDocId = await getUserDocId(contact);
    setOtherUserDocId(otherUserDocId);
    const otherUserContactsRef = collection(
      db,
      "users",
      otherUserDocId,
      "contacts"
    );
    const otherUserContactQuery = query(
      otherUserContactsRef,
      where("uid", "==", user.uid)
    );

    try {
      const querySnapshot = await getDocs(contactQuery);
      const OtherUserQuerySnapshot = await getDocs(otherUserContactQuery);
      if (querySnapshot.empty && OtherUserQuerySnapshot.empty) {
        const docRef = await addDoc(contactsRef, {
          displayName: contact.displayName,
          photoURL: contact.photoURL,
          email: contact.email,
          uid: contact.uid,
          messages: [],
        });
        setChatId(docRef.id);
        console.log("Current User Contact added with ID:", docRef.id);

        const otherUserDocRef = await addDoc(otherUserContactsRef, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          uid: user.uid,
          messages: [],
        });
        setOtherUserChatId(otherUserDocRef.id);

        console.log(
          "Contact added to the other user's contacts WITH ID",
          otherUserDocRef.id
        );
      } else {
        console.log("Contact already exists:", contact.uid);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
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
