import { useMemo, useState } from "react";
import ImageCard from "../components/ImageCard";
import CardModal from "../components/CardModal";
import SearchAndFilter from "../components/SearchAndFilter.jsx";
import LoginRequiredModal from "../components/LoginRequiredModal.jsx";
import CollectionStatusAlert from "../components/CollectionStatusAlert.jsx";
import { RARITY_ORDER, normalizeRarity } from "../util/rarity.js";

import { useCards } from "../hooks/useCards.js";
import { useCollection } from "../hooks/useCollection.js";
import { useFavoriteActions } from "../hooks/useFavoriteActions.js";
import "../styles/components.css"; // grid styling

export default function CardSearch() {

  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSets, setSelectedSets] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [raritySortDirection, setRaritySortDirection] = useState("asc");
  const { addToCollection, removeFromCollection, isSaved } = useCollection();
  const {
    showLoginModal,
    setShowLoginModal,
    collectionStatus,
    collectionStatusType,
    clearCollectionStatus,
    handleAddToCollection,
    handleRemoveFromCollection
  } = useFavoriteActions({ addToCollection, removeFromCollection });

    const availableSets = useMemo(() => {
        const unique = new Set(cards.map((card) => card.setName).filter(Boolean));
        return Array.from(unique).sort();
    }, [cards]);

    function toggleSetFilter(setName) {
        setSelectedSets((prev) =>
            prev.includes(setName) ? prev.filter((s) => s !== setName) : [...prev, setName]
        );
    }

    function toggleRarityFilter(rarityCode) {
        setSelectedRarities((prev) =>
            prev.includes(rarityCode) ? prev.filter((r) => r !== rarityCode) : [...prev, rarityCode]
        );
    }

    function handleResetFilters() {
        setSelectedSets([]);
        setSelectedRarities([]);
        setRaritySortDirection("asc");
    }

    const visibleCards = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        const filtered = cards.filter((card) => {
            const setName = (card.setName || "").toLowerCase();
            const characters = card.characters || [];

            const matchesSearch =
                !term ||
                setName.includes(term) ||
                characters.some((character) => character.toLowerCase().includes(term));

            const matchesSet = selectedSets.length === 0 || selectedSets.includes(card.setName);

            const cardRarity = normalizeRarity(card.rarity);
            const matchesRarity =
                selectedRarities.length === 0 || selectedRarities.includes(cardRarity);

            return matchesSearch && matchesSet && matchesRarity;
        });

        return [...filtered].sort((a, b) => {
            const rankA = RARITY_ORDER.indexOf(normalizeRarity(a.rarity));
            const rankB = RARITY_ORDER.indexOf(normalizeRarity(b.rarity));
            const safeRankA = rankA === -1 ? RARITY_ORDER.length : rankA;
            const safeRankB = rankB === -1 ? RARITY_ORDER.length : rankB;

            return raritySortDirection === "asc" ? safeRankA - safeRankB : safeRankB - safeRankA;
        });
    }, [cards, searchTerm, selectedSets, selectedRarities, raritySortDirection]);

  return (
    <>
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        availableSets={availableSets}
        selectedSets={selectedSets}
        onToggleSet={toggleSetFilter}
        selectedRarities={selectedRarities}
        onToggleRarity={toggleRarityFilter}
        raritySortDirection={raritySortDirection}
        onRaritySortDirectionChange={setRaritySortDirection}
        onReset={handleResetFilters}
      />

      <CollectionStatusAlert
        status={collectionStatus}
        statusType={collectionStatusType}
        onDismiss={clearCollectionStatus}
      />

      {visibleCards.length === 0 ? (
        <p>No cards match your search.</p>
      ) : (
        <div className="card-grid">
          {visibleCards.map(card => (
            <ImageCard
              key={card.id}
              image={card.imageURL}
              onClick={() => setSelectedCard(card)}
            />
          ))}
        </div>
      )}

      {selectedCard && (
        <CardModal
            open={true}
            onClose={() => setSelectedCard(null)}
            image={selectedCard.imageURL}
            title={selectedCard.id}
            description={`${selectedCard.setName} - ${selectedCard.characters.join(", ")}`}
            action={
              isSaved(selectedCard) ? (
                <button className="btn btn-outline-danger" onClick={() => handleRemoveFromCollection(selectedCard)}>
                  Remove from Favorites
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => handleAddToCollection(selectedCard)}>
                  Add to Favorites
                </button>
              )
            }
        />
      )}

      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
          message="Please log in to add cards to your favorites."
        />
      )}
    </>
  );
}
