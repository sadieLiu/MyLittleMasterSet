import { useEffect, useMemo, useState } from "react";
import {
    collection,
    doc,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    writeBatch
} from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "./useAuth.jsx";

export function getCollectionItemId(card) {
    return card.id;
}

export function useCollection() {
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser) {
            setItems([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const collectionRef = collection(db, "users", currentUser.uid, "favorites");
        const collectionQuery = query(collectionRef, orderBy("addedAt", "desc"));

        const unsubscribe = onSnapshot(
            collectionQuery,
            (snapshot) => {
                const savedCards = snapshot.docs.map((docSnap) => ({
                    collectionId: docSnap.id,
                    ...docSnap.data()
                }));

                setItems(savedCards);
                setError("");
                setLoading(false);
            },
            () => {
                setError("Unable to load your favorites right now.");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    const itemIds = useMemo(
        () => new Set(items.map((item) => item.collectionId)),
        [items]
    );

    async function addToCollection(card) {
        if (!currentUser) throw new Error("login-required");

        const collectionId = getCollectionItemId(card);
        const itemRef = doc(db, "users", currentUser.uid, "favorites", collectionId);
        const cardRef = doc(db, "cards", card.id);

        const batch = writeBatch(db);

        batch.set(itemRef, {
            id: card.id,
            imageURL: card.imageURL,
            setName: card.setName,
            characters: card.characters,
            rarity: card.rarity,
            ownerName: currentUser.displayName || currentUser.email,
            addedAt: serverTimestamp()
        });

        batch.set(cardRef, { favoritesCounter: increment(1) }, { merge: true });

        for (const character of card.characters || []) {
            const characterRef = doc(db, "characters", character);
            batch.set(characterRef, { favoritesCounter: increment(1) }, { merge: true });
        }

        await batch.commit();
    }

    async function removeFromCollection(card) {
        if (!currentUser) throw new Error("login-required");

        const collectionId = card.collectionId || getCollectionItemId(card);
        const itemRef = doc(db, "users", currentUser.uid, "favorites", collectionId);
        const cardRef = doc(db, "cards", card.id);

        const batch = writeBatch(db);

        batch.delete(itemRef);
        batch.set(cardRef, { favoritesCounter: increment(-1) }, { merge: true });

        for (const character of card.characters || []) {
            const characterRef = doc(db, "characters", character);
            batch.set(characterRef, { favoritesCounter: increment(-1) }, { merge: true });
        }

        await batch.commit();
    }

    return {
        addToCollection,
        removeFromCollection,
        items,
        loading,
        error,
        isSaved: (card) => itemIds.has(getCollectionItemId(card))
    };
}
