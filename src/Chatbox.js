import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Image,
} from "react-bootstrap";

import {
  colRef,
  auth,
  signInWithGoogle,
  addDoc,
  query,
  logOut,
} from "./firebase";
import { orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { serverTimestamp } from "firebase/firestore";

const Chatbox = () => {
  const [user, loading, error] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(colRef, {
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        text: input,
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "asc"), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("hello");
      setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Sidebar */}

        {/* Chat Section */}
        <Col className="d-flex flex-column">
          {/* Chat Header */}
          <div
            style={{ position: "sticky", top: "0", background: "white" }}
            className="p-3 d-flex align-items-center gap-3 border-bottom"
          >
            <Image
              src={user.photoURL}
              roundedCircle
              width={40}
              height={40}
              alt="Profile"
            />
            <div className="flex-grow text-start">
              <h6 className="mb-0">{user.displayName}</h6>
              <small className="text-muted">{user.email}</small>
            </div>
            <Button variant="outline-primary" onClick={logOut}>
              Sign Out
            </Button>
          </div>

          {/* Chat Messages */}
          {/* Chat Messages */}
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`d-flex gap-3 mb-3 ${
                message.uid === user.uid
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              {/* Message Text (Left or Right) */}
              <div
                className={`p-3 border rounded-3 ${
                  message.uid === user.uid
                    ? "bg-primary text-white"
                    : "bg-light"
                } max-w-75`}
                style={{
                  maxWidth: "100%", // Restricts message width
                  wordBreak: "break-word",
                }}
              >
                <p className="mb-0">{message.text}</p>
              </div>

              {/* User Info (Right) */}
              <div
                className={`d-flex flex-column align-items-center ${
                  message.uid === user.uid ? "order-1" : "order-0"
                }`}
              >
                <img
                  src={message.avatar}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-circle border"
                />
                <small className="text-muted">
                  {message.createdAt &&
                    new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(message.createdAt.seconds * 1000))}
                </small>
              </div>
            </div>
          ))}

          <div ref={scrollRef}></div>

          {/* Message Input */}
          <div
            className="p-3 border-top input-container"
            style={{ background: "white" }}
          >
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" variant="primary">
                  Send
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chatbox;
