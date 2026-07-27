import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";
import ImageCard from "../components/ImageCard.jsx";
import CardModal from "../components/CardModal.jsx";

export default function SharedFavoritesPage() {
    const { uid } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadFavorites() {
            setLoading(true);
            setError("");

            try {
                const favoritesRef = collection(db, "users", uid, "favorites");
                const favoritesQuery = query(favoritesRef, orderBy("addedAt", "desc"));
                const snapshot = await getDocs(favoritesQuery);

                if (!isMounted) return;

                setItems(
                    snapshot.docs.map((docSnap) => ({
                        collectionId: docSnap.id,
                        ...docSnap.data()
                    }))
                );
            } catch (fetchError) {
                console.error("Unable to load this favorites list.", fetchError);
                if (isMounted) setError("This favorites list is unavailable right now.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadFavorites();

        return () => {
            isMounted = false;
        };
    }, [uid]);

    const ownerName = items[0]?.ownerName;
    const pageTitle = ownerName ? `${ownerName}'s Favorites` : "Shared Favorites";

    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">{pageTitle}</h2>
                    {loading && <p className="mb-0">Loading this favorites list...</p>}
                    {error && <p className="alert alert-warning mb-0">{error}</p>}
                    {!loading && !error && items.length === 0 && (
                        <p className="mb-0">This favorites list is empty.</p>
                    )}
                </div>
            </section>

            <div className="card-grid">
                {items.map((card) => (
                    <ImageCard
                        key={card.collectionId}
                        image={card.imageURL}
                        onClick={() => setSelectedCard(card)}
                    />
                ))}
            </div>

            {selectedCard && (
                <CardModal
                    open={true}
                    onClose={() => setSelectedCard(null)}
                    image={selectedCard.imageURL}
                    title={selectedCard.id}
                    description={`${selectedCard.setName} - ${(selectedCard.characters || []).join(", ")}`}
                />
            )}
        </>
    );
}
