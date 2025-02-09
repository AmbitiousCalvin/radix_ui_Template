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
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chat">
        <div className="chat__messages">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`chat__message ${
                item.userId === user.uid ? "right" : "left"
              }`}
            >
              <div
                className="chat__message-profile-container"
                style={{ "--user-name": `'${user.displayName.slice(0, 1)}'` }}
              >
                <img
                  className="profile"
                  src={item.profile}
                  width={20}
                  height={20}
                  alt="Profile"
                />
              </div>
              <div
                className={`chat__message-content-container ${
                  item.userId === user.uid ? "right" : "left"
                }`}
              >
                <span className="chat__message-user">{item.userName}</span>
                <p className="chat__message-content">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
        <span ref={scrollRef}></span>
        <ChatFooter />
      </div>
    </>
  );
}

const ChatFooter = () => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const { contact } = useContact();

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
      <Flex gap="2" className="send-msg-container">
        <form onSubmit={sendMessage}>
          <TextField.Root
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
        </form>
      </Flex>
    </div>
  );
};
