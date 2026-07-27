import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase.js";

export function useCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadCards() {
            setLoading(true);
            setError("");

            try {
                const snapshot = await getDocs(collection(db, "cards"));
                const items = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const data = docSnap.data();

                        try {
                            const url = await getDownloadURL(ref(storage, data.filePath));
                            return { id: docSnap.id, ...data, imageURL: url };
                        } catch (storageError) {
                            console.error("Storage error for:", data.filePath, storageError);
                            return { id: docSnap.id, ...data, imageURL: null };
                        }
                    })
                );

                if (isMounted) setCards(items);
            } catch (fetchError) {
                console.error("Unable to load cards.", fetchError);
                if (isMounted) setError("Unable to load cards right now.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadCards();

        return () => {
            isMounted = false;
        };
    }, []);

    return { cards, loading, error };
}
