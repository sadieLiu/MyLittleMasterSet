import ImageCard from "./ImageCard.jsx";
import { useCards } from "../hooks/useCards.js";
import "../styles/components.css";

const SECONDS_PER_CARD = 12;
const MIN_DURATION_SECONDS = 10;

export default function CardCarousel() {
  const { cards, loading, error } = useCards();

  const cardsWithImages = cards.filter((card) => card.imageURL);
  const duration = Math.max(cardsWithImages.length * SECONDS_PER_CARD, MIN_DURATION_SECONDS);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title h5">Browse Cards</h2>

        {loading && <p className="mb-0">Loading cards...</p>}
        {error && <p className="alert alert-warning mb-0">{error}</p>}
        {!loading && !error && cardsWithImages.length === 0 && (
          <p className="text-muted mb-0">No cards to show yet.</p>
        )}

        {!loading && !error && cardsWithImages.length > 0 && (
          <div className="carousel-viewport">
            <div
              className="carousel-track carousel-track-auto"
              style={{ "--carousel-duration": `${duration}s` }}
            >
              {[...cardsWithImages, ...cardsWithImages].map((card, index) => (
                <ImageCard key={`${card.id}-${index}`} image={card.imageURL} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
