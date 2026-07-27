import { useState } from "react";
import { useAuth } from "./useAuth.jsx";

export function useFavoriteActions({ addToCollection, removeFromCollection, onRemoveSuccess }) {
    const { currentUser } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [collectionStatus, setCollectionStatus] = useState("");
    const [collectionStatusType, setCollectionStatusType] = useState("");

    async function handleAddToCollection(card) {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        try {
            await addToCollection(card);
            setCollectionStatus(`Card ${card.id} was added to your favorites.`);
            setCollectionStatusType("success");
        } catch (error) {
            console.error("Unable to add this card right now.", error);
            setCollectionStatus("Unable to add this card right now.");
            setCollectionStatusType("warning");
        }
    }

    async function handleRemoveFromCollection(card) {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        try {
            await removeFromCollection(card);
            setCollectionStatus(`Card ${card.id} was removed from your favorites.`);
            setCollectionStatusType("success");
            onRemoveSuccess?.(card);
        } catch (error) {
            console.error("Unable to remove this card right now.", error);
            setCollectionStatus("Unable to remove this card right now.");
            setCollectionStatusType("warning");
        }
    }

    return {
        showLoginModal,
        setShowLoginModal,
        collectionStatus,
        collectionStatusType,
        clearCollectionStatus: () => setCollectionStatus(""),
        handleAddToCollection,
        handleRemoveFromCollection
    };
}
