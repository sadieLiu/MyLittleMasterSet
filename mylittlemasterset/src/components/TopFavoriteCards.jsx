import { useEffect, useRef, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase.js";
import ImageCard from "./ImageCard.jsx";
import "../styles/components.css";

export default function TopFavoriteCards({ resultLimit = 3 }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequestId = useRef(0);

  useEffect(() => {
    const topQuery = query(
      collection(db, "cards"),
      orderBy("favoritesCounter", "desc"),
      limit(resultLimit)
    );

    const unsubscribe = onSnapshot(
      topQuery,
      async (snapshot) => {
        const requestId = ++latestRequestId.current;

        try {
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

          if (requestId === latestRequestId.current) {
            setCards(items);
            setLoading(false);
          }
        } catch (resolveError) {
          console.error("Unable to load top cards.", resolveError);
          if (requestId === latestRequestId.current) {
            setError("Unable to load these cards right now.");
            setLoading(false);
          }
        }
      },
      (snapshotError) => {
        console.error("Unable to load top cards.", snapshotError);
        setError("Unable to load these cards right now.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [resultLimit]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title h5">Top Cards</h2>

        {loading && <p className="mb-0">Loading...</p>}
        {error && <p className="alert alert-warning mb-0">{error}</p>}
        {!loading && !error && cards.length === 0 && (
          <p className="text-muted mb-0">No favorites yet.</p>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="top-cards">
            {cards.map((card) => (
              <div key={card.id} className="top-card-item">
                <ImageCard image={card.imageURL} />
                <div className="top-card-info">
                  <p className="mb-0"><strong>{card.id}</strong></p>
                  <p className="mb-0 text-muted">{card.setName}</p>
                  <p className="mb-0 text-muted">{(card.characters || []).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
