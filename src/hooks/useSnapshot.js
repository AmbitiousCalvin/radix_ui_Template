import { onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

export function useSnapshot(query, setState) {
  useEffect(() => {
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        console.log("Doc data:", doc.data());

        return { ...doc.data(), id: doc.id };
      });

      setState(users);
    });

    return () => unsubscribe();
  }, [query]);
}
