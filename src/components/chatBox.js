import "../styles/chatBox.scss";
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
import { useState, useEffect, memo, useRef } from "react";
import { auth, logOut, usersRef, db, chatsRef } from "../firebase";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useLayoutContext } from "../contexts/LayoutContext";

import {
  getDoc,
  where,
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSnapshot } from "../hooks/useSnapshot";
import { useContact } from "../contexts/ContactContext";

export function ChatBox() {
  return (
    <>
      <div className="chat">
        <ChatMessagesContainer />
        <ChatFooter />
      </div>
    </>
  );
}

const ChatMessagesContainer = memo(() => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const { contact } = useContact();

  useEffect(() => {
    if (!contact) return;
    const chatId = `${user.uid}_${contact.uid}`;
    const chatRef = doc(chatsRef, chatId);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        console.log("Doc data:", doc.data());

        return { ...doc.data(), id: doc.id };
      });

      setMessages(users);
    });

    return () => unsubscribe();
  }, [contact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chat__messages">
        {messages.map((item) => (
          <MessageItem item={item} user={user} contact={contact} />
        ))}
      </div>
      <span ref={scrollRef}></span>
    </>
  );
});

const MessageItem = memo(({ item, user, contact }) => {
  const className = `${
    item.senderId === user.uid ? "chat__message right" : "chat__message left"
  }`;

  return (
    <Card className={className}>
      <Flex gap="2" align="center">
        <Avatar
          size="2"
          src={item.senderId === user.uid ? user.photoURL : contact.photoURL}
          radius="full"
          fallback={
            item.senderId === user.uid
              ? user.displayName.charAt(0)
              : contact.displayName.charAt(0)
          }
        />
        <Box>
          <Text as="div" size="2" weight="bold">
            {item.senderId === user.uid
              ? user.displayName
              : contact.displayName}
          </Text>
          <Text as="div" size="2" color="gray">
            {item.content}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
});

const ChatFooter = memo(() => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const { contact } = useContact();

  if (!contact) return <h1>Loading...</h1>;

  const sendMessage = async (e) => {
    e.preventDefault();
    const temp = input;
    setInput("");
    console.log(contact);

    try {
      const chatId = `${user.uid}_${contact.uid}`;
      const chatRef = doc(chatsRef, chatId);
      const chatSnapshot = await getDoc(chatRef);

      if (chatSnapshot.exists()) {
        const messagesRef = collection(chatRef, "messages");
        await addDoc(messagesRef, {
          senderId: user.uid,
          content: temp,
          createdAt: serverTimestamp(),
        });

        console.log("message sent to this chatroom");
      } else {
        console.log("chatSnapshot does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-footer">
      <form style={{ width: "100%" }} onSubmit={sendMessage}>
        <Flex gap="2" className="send-msg-container">
          <TextField.Root
            value={input}
            onInput={(e) => setInput(e.target.value)}
            size="3"
            className="send-msg-container__input"
            placeholder="Search the docs…"
          >
            <TextField.Slot>
              <IconButton size="1" variant="ghost">
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </TextField.Slot>
            <TextField.Slot>
              <IconButton size="1" variant="ghost" radius="full">
                {" "}
                <SendIcon fontSize="small" />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>

          <Button size="3" className="send-msg-container__btn">
            Send
          </Button>
        </Flex>
      </form>
    </div>
  );
});
