import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Chatbox from "./Chatbox";
import {
  colRef,
  auth,
  signInWithGoogle,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { serverTimestamp } from "firebase/firestore";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function App() {
  const [user, loading, error] = useAuthState(auth);
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
    <div className="App">
      {!user && (
        <Button variant="primary" onClick={signInWithGoogle}>
          Sign In with Google
        </Button>
      )}
      {user !== null && <Chatbox />}
    </div>
  );
}
