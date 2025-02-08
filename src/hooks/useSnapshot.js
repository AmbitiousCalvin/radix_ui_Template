import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useSnapshot(query, setState) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        console.log("Doc data:", doc.data());

        return { ...doc.data(), id: doc.id };
      });

      setState(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [query]);

  return { loading };
}
