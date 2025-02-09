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
import { useLayoutContext } from "../contexts/LayoutContext";

import {
  where,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
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
        <ChatFooter />
      </div>
    </>
  );
}

const ChatFooter = () => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const { chatId, otherUserDocId, otherUserChatId } = useLayoutContext();

  const getUserDocId = async (user) => {
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

  const sendMessage = async (e) => {
    e.preventDefault();
    const userDocId = await getUserDocId(user);
    if (!userDocId) return;
    if (!chatId) return console.error("chatId is undefined");

    const userRef = doc(db, "users", userDocId, "contacts", chatId);
    const OtherUserRef = doc(
      db,
      "users",
      otherUserDocId,
      "contacts",
      otherUserChatId
    );

    const messageText = input;
    setInput("");

    const newMessage = {
      sender: user.uid,
      text: messageText,
      timestamp: new Date(),
    };

    try {
      await updateDoc(userRef, {
        messages: arrayUnion(newMessage),
      });
      await updateDoc(OtherUserRef, {
        messages: arrayUnion(newMessage),
      });
      console.log("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
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
