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
import { auth, messagesRef, logOut, usersRef } from "../firebase";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import {
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export function ChatBox() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const msgQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const tempVariable = input;
      setInput("");
      await addDoc(messagesRef, {
        userName: user.displayName,
        userId: user.uid,
        content: tempVariable,
        profile: user.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  }

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
        <div className="chat-footer">
          <Flex gap="2" className="send-msg-container">
            <TextField.Root
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
        </div>
      </div>
    </>
  );
}
